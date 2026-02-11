import React from "react";
import ProgressBar from "./ProgressBar.jsx";

export default function BudgetList({ budgets, spendByCategory }) {
  return (
    <div className="budget-list">
      {budgets.map((budget) => {
        const spent = spendByCategory[budget.category] || 0;
        const percent = Math.min((spent / budget.limit) * 100, 100);
        return (
          <ProgressBar
            key={budget.category}
            label={budget.category}
            value={percent}
            subLabel={`${spent.toFixed(2)} / ${budget.limit.toFixed(2)}`}
            accent={budget.accent}
          />
        );
      })}
    </div>
  );
}
