"use client"
import { LoginFormData, LoginFormErrors, LoginStatus } from "@/types/auth"
import { useState } from "react"
import { Button } from "../Button/Button"
import styles from './LoginForm.module.scss'

async function fakeLoginRequest(data: LoginFormData) {
  await new Promise((r) => setTimeout(r, 800));
  return data.email === "test@test.com" && data.password === "1234"
    ? { success: true }
    : { success: false, error: "Ungültige Zugangsdaten" };
}

/*  TODO: 
    - add real validation 
    - complete styles
    - add real Request
    - add naviagtion on success
    - think about styling page.module.scss in LoginPage and App nearly same
    - cleanup / customHook for validation
*/

const LoginForm = () => {
    const [form, setForm] = useState<LoginFormData>({
        email: "",
        password: "",
        rememberMe: false
    })

    const [errors, setErrors] = useState<LoginFormErrors>({})
    const [status, setStatus] = useState<LoginStatus>("idle")

    const validate = (): boolean => {
        const newErrors: LoginFormErrors = {}
        if(!form.email) newErrors.email = "Email erforderlich"
        if(!form.password) newErrors.password = "Passwort erforderlich"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!validate()) return
        setStatus("loading");

        // TODO: add real request
        const res = await fakeLoginRequest(form)
        if(res.success) {
            setStatus("success")
            return
        } else {
            setStatus("error")
            setErrors({ general: res.error ?? "Login fehlgeschlagen" })
            return
        }
    }

    return(
        <form className={styles.form} onSubmit={handleSubmit}>
            {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
            <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="password">Passwort</label>
                <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                />
            </div>
            <div className={styles.field}>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={form.rememberMe}
                        onChange={(e) => setForm({...form, rememberMe: e.target.checked})}
                    />
                </label>
            </div>
            <div className={styles.actions}>
                <Button disabled={status === "loading"}>
                    {status === "loading" ? "Logge ein..." : "Login"}
                </Button>
            </div>
        </form>
    )
}

export default LoginForm