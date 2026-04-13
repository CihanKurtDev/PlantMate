"use client"

import { LoginFormData, LoginStatus } from "@/types/auth"
import { useState } from "react"
import styles from "./LoginForm.module.scss"
import { useLoginValidation } from "@/hooks/useLoginValidation"
import { hasValidationErrors } from "@/helpers/validationUtils"
import { useRouter } from "next/navigation"
import Form from "@/components/Form/Form"
import { Input } from "@/components/Form/Input"
import Checkbox from "@/components/Checkbox/Checkbox"
import { Button } from "@/components/Button/Button"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

const LoginForm = () => {
    const [form, setForm] = useState<LoginFormData>({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [status, setStatus] = useState<LoginStatus>("idle")
    const [serverError, setServerError] = useState<string | undefined>()

    const { validate } = useLoginValidation()
    const router = useRouter()
    const { login } = useAuth()

    const validationErrors = validate(form)
    const isDisabled = status === "loading" || hasValidationErrors(validationErrors)

    const handleChange = (field: "email" | "password", value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setServerError(undefined)
        if (hasValidationErrors(validationErrors)) return

        setStatus("loading")
        const res = await login(form)

        if (!res.success) {
            setStatus("error")
            setServerError(res.error ?? "Login fehlgeschlagen")
            return
        }

        setStatus("success")
        router.push("/dashboard")
    }

    return (
        <Form onSubmit={handleSubmit}>
            {serverError && <p className={styles.errorMessage}>{serverError}</p>}

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

            <p>
                Noch kein Konto? <Link href="/register">Jetzt registrieren</Link>
            </p>
        </Form>
    )
}

export default LoginForm