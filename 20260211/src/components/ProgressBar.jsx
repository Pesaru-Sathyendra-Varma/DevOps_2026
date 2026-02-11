import React from "react";

export default function ProgressBar({ label, value, subLabel, accent = "green" }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-block">
      <div className="progress-meta">
        <span>{label}</span>
        <span className="muted-text">{subLabel}</span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill accent-${accent}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
