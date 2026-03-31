"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Moon, Sun } from "lucide-react";
import { Button } from "../Button/Button";

type Theme = "light" | "dark";

const STORAGE_KEY = "plantmate-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return getSystemTheme();
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <header className={styles.header}>
      <h1>
        <Link className={styles.logo} href="/">
          Plant Mate
        </Link>
      </h1>

      <div className={styles.right}>
        <nav>
          <ul className={styles.navList}>
            <li><Link className={styles.link} href="/">Home</Link></li>
            <li><Link className={styles.link} href="/dashboard">Dashboard</Link></li>
            <li><Link className={styles.link} href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <Button
          type="button"
          className={styles.themeToggleButton}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
        </Button>
      </div>
    </header>
  );
}