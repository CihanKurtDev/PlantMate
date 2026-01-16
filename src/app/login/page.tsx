import LoginForm from './components/LoginForm'
import styles from './LoginPage.module.scss'

const LoginPage = () => (
    <div className={styles.page}>
        <div className={styles.card}>
            <h1>Login</h1>
            <LoginForm />
        </div>
    </div>
)

export default LoginPage