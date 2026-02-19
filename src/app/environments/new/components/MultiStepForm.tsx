"use client"

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EnvironmentForm } from "./EnvironmentForm";
import { PlantForm } from "./PlantForm";
import styles from "./MultiStepForm.module.scss";

export const MultiStepForm = () => {
    const [step, setStep] = useState<"environment" | "plant">("environment");
    const [createdEnvironmentId, setCreatedEnvironmentId] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEditMode = !!searchParams.get("editId");

    const handleEnvironmentSaved = (envId: string, nextStep: "plant" | "dashboard") => {
        if (nextStep === "plant") {
            setCreatedEnvironmentId(envId);
            setStep("plant");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className={styles.multistepContainer}>
            {!isEditMode && (
                <>
                    <div className={styles.stepIndicator}>
                        <div className={`${styles.stepDot} ${step === "environment" ? styles.active : ""}`}>1</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.stepDot} ${step === "plant" ? styles.active : ""}`}>2</div>
                    </div>
                </>
            )}
            {step === "environment" ? (
                <>
                    {!isEditMode ? <h2 className={styles.stepTitle}>Environment bearbeiten</h2> : <h2 className={styles.stepTitle}>Environment erstellen</h2>}
                    <EnvironmentForm onSaved={handleEnvironmentSaved} />
                </>
            ) : (
                <>
                    <PlantForm environmentId={createdEnvironmentId} />
                </>
            )}
        </div>
    );
};