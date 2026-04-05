"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Moon, Sun } from "lucide-react";
import { Button } from "../Button/Button";
import { DemoButton } from "@/demo/DemoButton";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
          </ul>
        </nav>

        <DemoButton />
        <Button
          type="button"
          className={styles.themeToggleButton}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Switch theme"}
        >
          {mounted && (resolvedTheme === "dark" ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          ))}
        </Button>
      </div>
    </header>
  );
}