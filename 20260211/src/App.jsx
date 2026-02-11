import React, { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage.jsx";
import AuthForm from "./components/AuthForm.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import {
  loadSession,
  saveSession,
  clearSession,
  loadUsers,
  saveUsers,
  loadTheme,
  saveTheme
} from "./services/storage.js";

export default function App() {
  const [theme, setTheme] = useState(loadTheme());
  const [user, setUser] = useState(loadSession());
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  const handleAuthSubmit = ({ username, password }) => {
    setAuthError("");
    if (!username || !password) {
      setAuthError("Please enter both username and password.");
      return;
    }

    const users = loadUsers();
    const normalized = username.trim().toLowerCase();

    if (authMode === "login") {
      const existing = users.find((item) => item.username === normalized);
      if (!existing || existing.password !== password) {
        setAuthError("Invalid username or password.");
        return;
      }
      const session = { username: existing.username };
      saveSession(session);
      setUser(session);
      return;
    }

    if (users.some((item) => item.username === normalized)) {
      setAuthError("Account already exists. Please log in.");
      return;
    }

    const newUser = { username: normalized, password };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    const session = { username: newUser.username };
    saveSession(session);
    setUser(session);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Personal Finance Tracker</p>
          <h1>Dashboard</h1>
        </div>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          {user && (
            <button className="secondary-button" onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </header>

      {!user ? (
        <AuthForm
          mode={authMode}
          error={authError}
          onSubmit={handleAuthSubmit}
          onToggleMode={() =>
            setAuthMode((current) => (current === "login" ? "signup" : "login"))
          }
        />
      ) : (
        <DashboardPage username={user.username} />
      )}
    </div>
  );
}
