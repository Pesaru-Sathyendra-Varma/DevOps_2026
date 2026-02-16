const API_BASE = "http://localhost:5000/api";

const balanceAmount = document.getElementById("balanceAmount");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const expenseList = document.getElementById("expenseList");
const incomeList = document.getElementById("incomeList");
const apiStatus = document.getElementById("apiStatus");
const lastUpdated = document.getElementById("lastUpdated");

const expenseTitle = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");
const incomeSource = document.getElementById("incomeSource");
const incomeAmount = document.getElementById("incomeAmount");

const refreshBtn = document.getElementById("refreshBtn");
const addExpenseBtn = document.getElementById("addExpense");
const addIncomeBtn = document.getElementById("addIncome");

function formatCurrency(value) {
  const number = Number(value) || 0;
  return `₹${number.toLocaleString("en-IN")}`;
}

function updateTimestamp() {
  const now = new Date();
  lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

function renderList(items, type) {
  return items
    .map((item) => {
      const label = type === "expense" ? item.title : item.source;
      return `
        <li class="list-item">
          <span>${label} – ${formatCurrency(item.amount)}</span>
          <span class="tag">${type === "expense" ? "Expense" : "Income"}</span>
        </li>
      `;
    })
    .join("");
}

async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) {
    throw new Error("Dashboard fetch failed");
  }
  return res.json();
}

async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) {
    throw new Error("Expenses fetch failed");
  }
  return res.json();
}

async function fetchIncome() {
  const res = await fetch(`${API_BASE}/income`);
  if (!res.ok) {
    throw new Error("Income fetch failed");
  }
  return res.json();
}

async function refreshData() {
  try {
    apiStatus.textContent = "API: connected";
    const [dashboard, expenses, income] = await Promise.all([
      fetchDashboard(),
      fetchExpenses(),
      fetchIncome(),
    ]);

    balanceAmount.textContent = formatCurrency(dashboard.balance);
    totalIncome.textContent = formatCurrency(dashboard.totalIncome);
    totalExpenses.textContent = formatCurrency(dashboard.totalExpenses);
    expenseList.innerHTML = renderList(expenses, "expense");
    incomeList.innerHTML = renderList(income, "income");
    updateTimestamp();
  } catch (error) {
    apiStatus.textContent = "API: offline";
  }
}

async function postExpense() {
  const title = expenseTitle.value.trim();
  const amount = expenseAmount.value.trim();
  if (!title || !amount) {
    return;
  }

  await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, amount: Number(amount) }),
  });

  expenseTitle.value = "";
  expenseAmount.value = "";
  await refreshData();
}

async function postIncome() {
  const source = incomeSource.value.trim();
  const amount = incomeAmount.value.trim();
  if (!source || !amount) {
    return;
  }

  await fetch(`${API_BASE}/income`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, amount: Number(amount) }),
  });

  incomeSource.value = "";
  incomeAmount.value = "";
  await refreshData();
}

refreshBtn.addEventListener("click", refreshData);
addExpenseBtn.addEventListener("click", postExpense);
addIncomeBtn.addEventListener("click", postIncome);

refreshData();
