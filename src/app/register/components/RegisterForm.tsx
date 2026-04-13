"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Form from "@/components/Form/Form";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { hasValidationErrors } from "@/helpers/validationUtils";
import { useAuth } from "@/context/AuthContext";
import type { RegisterFormData } from "@/types/auth";
import styles from "./RegisterForm.module.scss";
import { useRegisterValidation } from "@/hooks/useRegisterValidation";

const RegisterForm = () => {
    const [form, setForm] = useState<RegisterFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [serverError, setServerError] = useState<string | undefined>();
    const { register } = useAuth();
    const router = useRouter();
    const { validate } = useRegisterValidation();

    const validationErrors = validate(form);
    const isDisabled = status === "loading" || hasValidationErrors(validationErrors);

    const handleChange = (field: keyof RegisterFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setServerError(undefined);
        if (hasValidationErrors(validationErrors)) return;

        setStatus("loading");
        const result = await register(form);

        if (!result.success) {
            setStatus("error");
            setServerError(result.error ?? "Registrierung fehlgeschlagen");
            return;
        }

        router.push("/dashboard");
    };

    return (
        <Form onSubmit={handleSubmit}>
            {serverError && <p className={styles.errorMessage}>{serverError}</p>}

            <Input
                id="name"
                label="Name"
                value={form.name}
                error={validationErrors.name}
                onChange={(event) => handleChange("name", event.target.value)}
                disabled={status === "loading"}
                required
            />

            <Input
                id="email"
                type="email"
                label="Email"
                value={form.email}
                error={validationErrors.email}
                onChange={(event) => handleChange("email", event.target.value)}
                disabled={status === "loading"}
                required
            />

            <Input
                id="password"
                type="password"
                label="Passwort"
                value={form.password}
                error={validationErrors.password}
                onChange={(event) => handleChange("password", event.target.value)}
                disabled={status === "loading"}
                required
            />

            <Input
                id="confirmPassword"
                type="password"
                label="Passwort bestätigen"
                value={form.confirmPassword}
                error={validationErrors.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                disabled={status === "loading"}
                required
            />

            <div className={styles.actions}>
                <Button disabled={isDisabled}>
                    {status === "loading" ? "Registriere..." : "Registrieren"}
                </Button>
            </div>

            <p>
                Schon ein Konto? <Link href="/login">Zum Login</Link>
            </p>
        </Form>
    );
};

export default RegisterForm;
