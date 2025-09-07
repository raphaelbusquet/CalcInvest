"use client";

import { useTheme } from "../_providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      aria-label={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
      style={{ 
        marginLeft: 8,
        color: theme === "light" ? "#000" : "#fff",
        fontSize: 10,
      }}
    >
      {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
