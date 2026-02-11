import React, { useMemo, useState, useEffect } from "react";
import StatCard from "../components/StatCard.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";
import SpendingTrendsChart from "../components/SpendingTrendsChart.jsx";
import BudgetList from "../components/BudgetList.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Card from "../components/Card.jsx";
import CalendarFilter from "../components/CalendarFilter.jsx";
import CalendarSummary from "../components/CalendarSummary.jsx";
import {
  addTransaction,
  calculateTotals,
  getCategoryTotals,
  getMonthlyExpenseSeries,
  getMonthlyTotals
} from "../services/finance.js";
import { loadTransactions, saveTransactions } from "../services/storage.js";

const budgets = [
  { category: "Dining", limit: 350, accent: "yellow" },
  { category: "Groceries", limit: 500, accent: "green" },
  { category: "Transport", limit: 220, accent: "green" }
];

const seedTransactions = [
  {
    id: "tx-1",
    title: "Salary",
    amount: 4200,
    type: "income",
    category: "Income",
    date: "2026-02-01"
  },
  {
    id: "tx-2",
    title: "Groceries",
    amount: 180,
    type: "expense",
    category: "Groceries",
    date: "2026-02-02"
  },
  {
    id: "tx-3",
    title: "Restaurant",
    amount: 65,
    type: "expense",
    category: "Dining",
    date: "2026-02-05"
  },
  {
    id: "tx-4",
    title: "Freelance",
    amount: 600,
    type: "income",
    category: "Income",
    date: "2026-02-07"
  },
  {
    id: "tx-5",
    title: "Commute",
    amount: 40,
    type: "expense",
    category: "Transport",
    date: "2026-02-08"
  }
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);

export default function DashboardPage({ username }) {
  const today = new Date();
  const [transactions, setTransactions] = useState(
    () => loadTransactions() || seedTransactions
  );
  const [period, setPeriod] = useState(() => ({
    month: today.getMonth(),
    year: today.getFullYear()
  }));

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((item) => {
        const date = new Date(item.date);
        if (Number.isNaN(date.getTime())) {
          return false;
        }
        return (
          date.getFullYear() === period.year &&
          date.getMonth() === period.month
        );
      }),
    [transactions, period]
  );

  const totals = useMemo(
    () => calculateTotals(filteredTransactions),
    [filteredTransactions]
  );
  const categoryTotals = useMemo(
    () => getCategoryTotals(filteredTransactions),
    [filteredTransactions]
  );
  const monthlySeries = useMemo(
    () =>
      getMonthlyExpenseSeries(
        transactions,
        6,
        new Date(period.year, period.month, 1)
      ),
    [transactions, period]
  );

  const monthSummaries = useMemo(
    () =>
      getMonthlyTotals(
        transactions,
        12,
        new Date(period.year, period.month, 1)
      ),
    [transactions, period]
  );

  const overviewPercent = totals.income
    ? Math.min((totals.expenses / totals.income) * 100, 100)
    : 0;

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const handleAddTransaction = (transaction) => {
    setTransactions((current) => addTransaction(current, transaction));
  };

  const handlePrevMonth = () => {
    setPeriod((current) => {
      const nextMonth = current.month - 1;
      if (nextMonth < 0) {
        return { month: 11, year: current.year - 1 };
      }
      return { month: nextMonth, year: current.year };
    });
  };

  const handleNextMonth = () => {
    setPeriod((current) => {
      const nextMonth = current.month + 1;
      if (nextMonth > 11) {
        return { month: 0, year: current.year + 1 };
      }
      return { month: nextMonth, year: current.year };
    });
  };

  const handleReset = () => {
    setPeriod({ month: today.getMonth(), year: today.getFullYear() });
  };

  const availableYears = useMemo(() => {
    const yearSet = new Set([today.getFullYear(), period.year]);
    transactions.forEach((item) => {
      const date = new Date(item.date);
      if (!Number.isNaN(date.getTime())) {
        yearSet.add(date.getFullYear());
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [transactions, period, today]);

  const periodLabel = useMemo(
    () =>
      new Date(period.year, period.month, 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric"
      }),
    [period]
  );

  return (
    <section className="dashboard">
      <div className="welcome-card card">
        <div>
          <p className="muted-text">Welcome back</p>
          <h2>{username}</h2>
        </div>
        <div className="pill">{periodLabel} Summary</div>
      </div>

      <CalendarFilter
        month={period.month}
        year={period.year}
        years={availableYears}
        onMonthChange={(month) => setPeriod((current) => ({ ...current, month }))}
        onYearChange={(year) => setPeriod((current) => ({ ...current, year }))}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onReset={handleReset}
      />

      <CalendarSummary
        months={monthSummaries}
        selectedMonth={period.month}
        selectedYear={period.year}
        onSelect={(month, year) => setPeriod({ month, year })}
        formatCurrency={formatCurrency}
      />

      <div className="stats-grid">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totals.balance)}
          accent="green"
        />
        <StatCard
          title="Income"
          value={formatCurrency(totals.income)}
          accent="green"
        />
        <StatCard
          title="Expenses"
          value={formatCurrency(totals.expenses)}
          accent="yellow"
        />
        <StatCard
          title="Savings Rate"
          value={`${totals.savingsRate.toFixed(1)}%`}
          accent="green"
        />
      </div>

      <div className="content-grid">
        <Card className="chart-card">
          <div className="card-header">
            <h3>Spending Trends</h3>
            <p className="muted-text">Last six months</p>
          </div>
          <div className="chart-container">
            <SpendingTrendsChart
              labels={monthlySeries.labels}
              values={monthlySeries.values}
            />
          </div>
        </Card>

        <Card className="overview-card">
          <div className="card-header">
            <h3>Monthly Overview</h3>
            <p className="muted-text">Expense ratio vs income</p>
          </div>
          <ProgressBar
            label="Spending"
            value={overviewPercent}
            subLabel={`${overviewPercent.toFixed(1)}%`}
            accent="yellow"
          />
          <div className="overview-metrics">
            <div>
              <p className="muted-text">Income</p>
              <p className="metric-value">{formatCurrency(totals.income)}</p>
            </div>
            <div>
              <p className="muted-text">Expenses</p>
              <p className="metric-value">{formatCurrency(totals.expenses)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="content-grid">
        <Card className="budget-card">
          <div className="card-header">
            <h3>Budgets</h3>
            <p className="muted-text">Track category limits</p>
          </div>
          <BudgetList budgets={budgets} spendByCategory={categoryTotals} />
        </Card>

        <Card className="transactions-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <p className="muted-text">Latest activity</p>
          </div>
          <TransactionList
            transactions={recentTransactions}
            formatCurrency={formatCurrency}
          />
        </Card>
      </div>

      <TransactionForm onAdd={handleAddTransaction} />
    </section>
  );
}
