"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "dark";
    setTheme(current);
  }, []);

  function flip() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("tud-theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`tud-theme-toggle ${compact ? "is-compact" : ""}`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      {!compact && <span className="tud-theme-label">{theme === "dark" ? "Light" : "Dark"}</span>}
      <style>{`
        .tud-theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(252,241,218,0.25);
          background: transparent;
          color: var(--_colours---light);
          cursor: pointer;
          font-family: Stack Sans, Arial, sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: border-color .2s, background .2s;
        }
        .tud-theme-toggle.is-compact {
          width: 40px; height: 40px;
          padding: 0;
          justify-content: center;
          border-radius: 4px;
        }
        .tud-theme-toggle:hover {
          border-color: var(--_colours---light);
        }
        html[data-theme="light"] .tud-theme-toggle {
          border-color: rgba(12,26,18,0.25);
        }
        html[data-theme="light"] .tud-theme-toggle:hover {
          border-color: #0c1a12;
        }
        .tud-theme-label { line-height: 1; }
      `}</style>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
