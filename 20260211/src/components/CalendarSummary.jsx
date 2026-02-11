import React from "react";
import Card from "./Card.jsx";

export default function CalendarSummary({
  months,
  selectedMonth,
  selectedYear,
  onSelect,
  formatCurrency
}) {
  return (
    <Card className="calendar-summary">
      <div className="card-header">
        <h3>Calendar Overview</h3>
        <p className="muted-text">Last 12 months</p>
      </div>
      <div className="calendar-grid">
        {months.map((item) => {
          const isSelected =
            item.month === selectedMonth && item.year === selectedYear;
          const balanceClass = item.balance >= 0 ? "text-green" : "text-red";
          return (
            <button
              key={item.key}
              type="button"
              className={`calendar-tile ${isSelected ? "is-active" : ""}`}
              onClick={() => onSelect(item.month, item.year)}
            >
              <span className="calendar-month">{item.label}</span>
              <span className={`calendar-balance ${balanceClass}`}>
                {formatCurrency(item.balance)}
              </span>
              <span className="calendar-meta">
                {formatCurrency(item.expenses)} spent
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
