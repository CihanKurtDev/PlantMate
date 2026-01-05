import Link from "next/link";
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <h1><Link className={styles.logo} href="/">Plant Mate</Link></h1>
      <nav>
        <ul className={styles.navList}>
          <li><Link className={styles.link} href="/">Home</Link></li>
          <li><Link className={styles.link} href="/dashboard">Dashbaord</Link></li>
          <li><Link className={styles.link} href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}