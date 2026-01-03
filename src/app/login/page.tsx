import LoginForm from '@/components/LoginForm/LoginForm'
import styles from './page.module.scss'
const LoginPage = () => (
    <div className={styles.page}>
        <main className={styles.main}>
            <h1>Login</h1>
            <LoginForm />
        </main>
    </div>
)

export default LoginPage