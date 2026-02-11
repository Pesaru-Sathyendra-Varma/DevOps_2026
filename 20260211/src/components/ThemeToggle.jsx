import React from "react";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="secondary-button"
      onClick={onToggle}
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
