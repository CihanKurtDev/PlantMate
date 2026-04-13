import RegisterForm from "./components/RegisterForm";
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => (
    <div className={styles.page}>
        <div className={styles.card}>
            <h1>Registrieren</h1>
            <RegisterForm />
        </div>
    </div>
);

export default RegisterPage;
