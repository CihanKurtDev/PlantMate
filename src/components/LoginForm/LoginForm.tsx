"use client"
import { LoginFormData, LoginFormErrors, LoginStatus } from "@/types/auth"
import { useState } from "react"
import { Button } from "../Button/Button"
import styles from "./LoginForm.module.scss"
import { useLoginValidation } from "@/hooks/useLoginValidation"
import { useRouter } from "next/navigation"
import { Input } from "../Form/Input"
import Checkbox from "../Form/Checkbox"

async function fakeLoginRequest(data: LoginFormData) {
    await new Promise(r => setTimeout(r, 800))
    return data.email === "test@test.de" && data.password === "1234"
        ? { success: true }
        : { success: false, error: "Ungültige Zugangsdaten" }
}

const LoginForm = () => {
    const [form, setForm] = useState<LoginFormData>({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [status, setStatus] = useState<LoginStatus>("idle")
    const [error, setError] = useState<string | undefined>()
    const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false,
    })

    const { validate } = useLoginValidation()
    const router = useRouter()
    const validationErrors = validate(form)
    const hasInvalidValues = Object.values(validationErrors).some(Boolean)
    const isDisabled = status === "loading" || hasInvalidValues

    const handleBlur = (field: "email" | "password") => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    const handleChange = (field: "email" | "password", value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ email: true, password: true })
        setError(undefined)
        if (hasInvalidValues) return
        setStatus("loading")
        const res = await fakeLoginRequest(form)

        if (!res.success) {
            setStatus("error")
            setError(res.error ?? "Login fehlgeschlagen")
            return
        }

        setStatus("success")
        router.push("/dashboard")
    }


    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <Input
                id="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={touched.email && validationErrors.email ? styles.inputError : ""}
                disabled={status === "loading"}
                required
            />
            {touched.email && validationErrors.email && (
                <span className={styles.fieldError}>{validationErrors.email}</span>
            )}

            <Input
                id="password"
                className={touched.password && validationErrors.password ? styles.inputError : ""}
                type="password"
                label="Passwort"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                required
            />

            {touched.password && validationErrors.password && (
                <span className={styles.fieldError}>{validationErrors.password}</span>
            )}

            <Checkbox
                label="Angemeldet bleiben"
                checked={form.rememberMe}
                onChange={checked => setForm(prev => ({ ...prev, rememberMe: checked }))}
                disabled={status === "loading"}
            />

            <div className={styles.actions}>
                <Button disabled={isDisabled}>
                    {status === "loading" ? "Logge ein..." : "Login"}
                </Button>
            </div>

            <p>test@test.de, 1234</p>
        </form>
    )
}

export default LoginForm
