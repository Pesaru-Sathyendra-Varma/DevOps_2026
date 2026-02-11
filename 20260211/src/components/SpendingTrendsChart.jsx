import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SpendingTrendsChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: values,
        backgroundColor: "rgba(46, 125, 50, 0.35)",
        borderColor: "rgba(46, 125, 50, 0.9)",
        borderWidth: 1,
        borderRadius: 12
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
}
