import { NavLink } from "react-router-dom";

const DashboardSidebar = () => (
  <aside className="dashboard-sidebar p-3 rounded-4">
    <h5 className="mb-3">Dashboard</h5>
    <div className="d-grid gap-2">
      <NavLink to="/dashboard" className="btn btn-outline-info">Overview</NavLink>
      <NavLink to="/dashboard?tab=recommended" className="btn btn-outline-info">Recommended</NavLink>
      <NavLink to="/dashboard?tab=favorites" className="btn btn-outline-info">Favorites</NavLink>
      <NavLink to="/dashboard?tab=analytics" className="btn btn-outline-info">Analytics</NavLink>
    </div>
  </aside>
);

export default DashboardSidebar;
