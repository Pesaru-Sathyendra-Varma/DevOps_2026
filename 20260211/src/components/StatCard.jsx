import React from "react";
import Card from "./Card.jsx";

export default function StatCard({ title, value, accent = "green" }) {
  return (
    <Card className={`stat-card accent-${accent}`}>
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </Card>
  );
}
