import React, { useState } from "react";
import Card from "./Card.jsx";

export default function AuthForm({ mode, onSubmit, onToggleMode, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <Card className="auth-card">
      <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
      <p className="muted-text">
        {mode === "login"
          ? "Log in to see your finance dashboard."
          : "Set up your account to start tracking."}
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="yourname"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
      <button type="button" className="link-button" onClick={onToggleMode}>
        {mode === "login"
          ? "Need a new account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </Card>
  );
}
