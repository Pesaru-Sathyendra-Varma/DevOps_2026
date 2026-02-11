import React from "react";

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export default function CalendarFilter({
  month,
  year,
  years,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onReset
}) {
  return (
    <div className="card calendar-card">
      <div>
        <p className="muted-text">Finance calendar</p>
        <h3>Review past months</h3>
      </div>
      <div className="calendar-controls">
        <button
          type="button"
          className="secondary-button"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          Prev
        </button>
        <div className="calendar-selects">
          <select
            className="calendar-select"
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            aria-label="Select month"
          >
            {monthLabels.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="calendar-select"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            aria-label="Select year"
          >
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          Next
        </button>
        <button type="button" className="primary-button" onClick={onReset}>
          This month
        </button>
      </div>
    </div>
  );
}
