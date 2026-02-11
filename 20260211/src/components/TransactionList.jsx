import React from "react";

export default function TransactionList({ transactions, formatCurrency }) {
  if (transactions.length === 0) {
    return <p className="muted-text">No transactions yet.</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="transaction-item">
          <div>
            <p className="transaction-title">{transaction.title}</p>
            <p className="muted-text">
              {transaction.category} - {transaction.date}
            </p>
          </div>
          <div
            className={`transaction-amount ${
              transaction.type === "income" ? "text-green" : "text-red"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </div>
        </li>
      ))}
    </ul>
  );
}
