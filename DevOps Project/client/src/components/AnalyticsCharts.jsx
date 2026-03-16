import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AnalyticsCharts = ({ destinations = [], reviewsCount = 0, favoritesCount = 0 }) => {
  const categoryMap = destinations.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + 1;
    return acc;
  }, {});

  const topRated = [...destinations].sort((a, b) => b.ratingsAverage - a.ratingsAverage).slice(0, 5);

  const categoryData = {
    labels: Object.keys(categoryMap),
    datasets: [{ label: "Popular Categories", data: Object.values(categoryMap), backgroundColor: ["#0dcaf0", "#20c997", "#ffc107", "#6610f2", "#fd7e14"] }]
  };

  const topRatedData = {
    labels: topRated.map((item) => item.name),
    datasets: [{ label: "Top Rated", data: topRated.map((item) => item.ratingsAverage), backgroundColor: "#0dcaf0" }]
  };

  const activityData = {
    labels: ["Saved Destinations", "Reviews Posted"],
    datasets: [{ data: [favoritesCount, reviewsCount], backgroundColor: ["#0dcaf0", "#20c997"] }]
  };

  return (
    <div className="row g-4">
      <div className="col-lg-6"><div className="card p-3 h-100"><h6>Most Popular Travel Categories</h6><Doughnut data={categoryData} /></div></div>
      <div className="col-lg-6"><div className="card p-3 h-100"><h6>Top Rated Destinations</h6><Bar data={topRatedData} /></div></div>
      <div className="col-lg-6"><div className="card p-3 h-100"><h6>User Activity Statistics</h6><Doughnut data={activityData} /></div></div>
    </div>
  );
};

export default AnalyticsCharts;
