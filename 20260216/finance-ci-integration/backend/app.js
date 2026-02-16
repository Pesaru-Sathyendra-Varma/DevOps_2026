const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const publicDir = path.join(__dirname, "..", "frontend");
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

// In-memory data (simple DB for assignment)
const seedExpenses = () => [
  { id: 1, title: "Groceries", amount: 500 },
  { id: 2, title: "Fuel", amount: 300 },
];

const seedIncome = () => [
  { id: 1, source: "Salary", amount: 10000 },
  { id: 2, source: "Freelance", amount: 2000 },
];

let expenses = seedExpenses();
let income = seedIncome();

function resetData() {
  expenses = seedExpenses();
  income = seedIncome();
}

// Utility: compute dashboard summary
function getDashboardSummary() {
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

function nextId(items) {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
}

// API 1: Dashboard summary
app.get("/api/dashboard", (req, res) => {
  res.status(200).json(getDashboardSummary());
});

// API 2: Expenses CRUD (GET/POST)
app.get("/api/expenses", (req, res) => {
  res.status(200).json(expenses);
});

app.post("/api/expenses", (req, res) => {
  const { title, amount } = req.body || {};
  if (!title || amount === undefined) {
    return res.status(400).json({ message: "title and amount are required" });
  }

  const expense = {
    id: nextId(expenses),
    title,
    amount: Number(amount),
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

// API 3: Income CRUD (GET/POST)
app.get("/api/income", (req, res) => {
  res.status(200).json(income);
});

app.post("/api/income", (req, res) => {
  const { source, amount } = req.body || {};
  if (!source || amount === undefined) {
    return res.status(400).json({ message: "source and amount are required" });
  }

  const incomeItem = {
    id: nextId(income),
    source,
    amount: Number(amount),
  };
  income.push(incomeItem);
  res.status(201).json(incomeItem);
});

module.exports = app;
module.exports._internal = {
  _resetData: resetData,
};
