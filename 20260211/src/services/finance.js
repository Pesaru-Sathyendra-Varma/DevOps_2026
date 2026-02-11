const normalizeAmount = (amount) => {
  const value = Number(amount);
  return Number.isFinite(value) ? value : 0;
};

const normalizeTransaction = (transaction) => {
  const now = new Date();
  const dateValue = transaction.date ? new Date(transaction.date) : now;
  const date = Number.isNaN(dateValue.getTime()) ? now : dateValue;

  return {
    id: transaction.id || crypto.randomUUID?.() || `tx-${Date.now()}`,
    title: transaction.title?.trim() || "Untitled",
    amount: normalizeAmount(transaction.amount),
    type: transaction.type === "income" ? "income" : "expense",
    category: transaction.category?.trim() || "Other",
    date: date.toISOString().slice(0, 10)
  };
};

export const calculateIncome = (transactions) =>
  transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + normalizeAmount(item.amount), 0);

export const calculateExpenses = (transactions) =>
  transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + normalizeAmount(item.amount), 0);

export const calculateSavingsRate = (income, expenses) => {
  if (income <= 0) {
    return 0;
  }
  return ((income - expenses) / income) * 100;
};

export const calculateTotals = (transactions) => {
  const income = calculateIncome(transactions);
  const expenses = calculateExpenses(transactions);
  const balance = income - expenses;
  const savingsRate = calculateSavingsRate(income, expenses);

  return {
    income,
    expenses,
    balance,
    savingsRate
  };
};

export const addTransaction = (transactions, transaction) => {
  const normalized = normalizeTransaction(transaction);
  return [normalized, ...transactions];
};

export const getCategoryTotals = (transactions, type = "expense") => {
  return transactions.reduce((totals, item) => {
    if (item.type !== type) {
      return totals;
    }
    const key = item.category || "Other";
    totals[key] = (totals[key] || 0) + normalizeAmount(item.amount);
    return totals;
  }, {});
};

export const getMonthlyExpenseSeries = (
  transactions,
  monthsToShow = 6,
  baseDate = new Date()
) => {
  const today = baseDate;
  const series = [];
  const totals = {};

  for (let index = monthsToShow - 1; index >= 0; index -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleString("en-US", { month: "short" });
    series.push({ key, label });
    totals[key] = 0;
  }

  transactions.forEach((item) => {
    if (item.type !== "expense") {
      return;
    }
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (key in totals) {
      totals[key] += normalizeAmount(item.amount);
    }
  });

  return {
    labels: series.map((item) => item.label),
    values: series.map((item) => totals[item.key])
  };
};

export const getMonthlyTotals = (
  transactions,
  monthsToShow = 12,
  baseDate = new Date()
) => {
  const series = [];
  const totals = {};

  for (let index = monthsToShow - 1; index >= 0; index -= 1) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    series.push({
      key,
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleString("en-US", { month: "short", year: "2-digit" })
    });
    totals[key] = { income: 0, expenses: 0 };
  }

  transactions.forEach((item) => {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!(key in totals)) {
      return;
    }
    if (item.type === "income") {
      totals[key].income += normalizeAmount(item.amount);
    } else {
      totals[key].expenses += normalizeAmount(item.amount);
    }
  });

  return series.map((item) => {
    const monthTotals = totals[item.key] || { income: 0, expenses: 0 };
    const balance = monthTotals.income - monthTotals.expenses;
    return {
      ...item,
      income: monthTotals.income,
      expenses: monthTotals.expenses,
      balance
    };
  });
};
