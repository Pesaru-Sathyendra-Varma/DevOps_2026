import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ darkMode, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Smart Tourism
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
            {user && <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>}
            {user?.role === "admin" && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
            {!user ? (
              <>
                <li className="nav-item"><NavLink className="btn btn-outline-light btn-sm" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="btn btn-info btn-sm" to="/register">Register</NavLink></li>
              </>
            ) : (
              <li className="nav-item"><button className="btn btn-outline-warning btn-sm" onClick={handleLogout}>Logout</button></li>
            )}
            <li className="nav-item">
              <button className="btn btn-sm btn-light" onClick={toggleTheme}>
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
