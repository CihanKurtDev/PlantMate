import { Link } from "react-router";
import styles from './NotFound.module.scss';

export const NotFound = () => {
  return (
    <main className={styles["not-found"]}>
        <h1>404</h1>
        <p>Die Seite konnte nicht gefunden werden.</p>
        <Link to="/">Zurück zur Startseite</Link>
    </main>
  );
};
