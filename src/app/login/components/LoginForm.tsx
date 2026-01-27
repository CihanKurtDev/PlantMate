"use client"
import { LoginFormData, LoginFormErrors, LoginStatus } from "@/types/auth"
import { useState } from "react"
import styles from "./LoginForm.module.scss"
import { useLoginValidation } from "@/hooks/useLoginValidation"
import { useRouter } from "next/navigation"
import { Input } from "@/components/Form/Input"
import Checkbox from "@/components/Form/Checkbox"
import { Button } from "@/components/Button/Button"

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

    const { validate } = useLoginValidation()
    const router = useRouter()
    const validationErrors = validate(form)
    const hasInvalidValues = Object.values(validationErrors).some(Boolean)
    const isDisabled = status === "loading" || hasInvalidValues

    const handleChange = (field: "email" | "password", value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
                error={validationErrors.email}
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                disabled={status === "loading"}
                required
            />

            <Input
                id="password"
                type="password"
                label="Passwort"
                error={validationErrors.password}
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                required
            />

            <Checkbox
                label="Angemeldet bleiben"
                checked={form.rememberMe || false}
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
