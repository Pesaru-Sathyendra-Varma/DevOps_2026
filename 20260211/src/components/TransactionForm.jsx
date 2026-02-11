import React, { useState } from "react";

const categories = [
  "Dining",
  "Groceries",
  "Transport",
  "Utilities",
  "Entertainment",
  "Other"
];

export default function TransactionForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !amount || !category || !date) {
      setError("Please complete all fields before saving.");
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    onAdd({
      title,
      amount: numericAmount,
      type,
      category,
      date
    });

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory(categories[0]);
    setDate("");
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>Add Transaction</h3>
        <p className="muted-text">Keep your daily cashflow updated.</p>
      </div>
      <div className="form-grid">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Coffee, Salary, Rent"
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </label>
        <label>
          Type
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" type="submit">
        Add transaction
      </button>
    </form>
  );
}
