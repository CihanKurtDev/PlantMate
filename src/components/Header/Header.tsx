"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Moon, Sun } from "lucide-react";
import { Button } from "../Button/Button";
import { DemoButton } from "@/demo/DemoButton";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { status, isAuthenticated, logout } = useAuth();

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
            {status === "loading" ? null : isAuthenticated ? (
              <li><Link className={styles.link} href="/dashboard">Dashboard</Link></li>
            ) : (
              <>
                <li><Link className={styles.link} href="/login">Login</Link></li>
                <li><Link className={styles.link} href="/register">Registrieren</Link></li>
              </>
            )}
          </ul>
        </nav>

        <DemoButton />
        {status !== "loading" && isAuthenticated && (
          <Button variant="secondary" size="sm" onClick={logout}>
            Logout
          </Button>
        )}
        <Button
          type="button"
          className={styles.themeToggleButton}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Theme wechseln"
        >
          <span className={styles.themeIconLight} aria-hidden="true">
            <Moon size={18} />
          </span>
          <span className={styles.themeIconDark} aria-hidden="true">
            <Sun size={18} />
          </span>
        </Button>
      </div>
    </header>
  );
}