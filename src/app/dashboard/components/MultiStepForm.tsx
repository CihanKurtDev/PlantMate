"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { EnvironmentForm } from "../../../components/EnvironmentForm/EnvironmentForm";
import { PlantForm } from "../../../components/PlantForm/PlantForm";
import styles from "./MultiStepForm.module.scss";
import { useModal } from "@/context/ModalContext";

export const MultiStepForm = () => {
    const [step, setStep] = useState<"environment" | "plant">("environment");
    const [createdEnvironmentId, setCreatedEnvironmentId] = useState<string>("");
    const searchParams = useSearchParams();
    const isEditMode = !!searchParams.get("editId");
    const { closeModal } = useModal()

    const handleEnvironmentSaved = (envId: string, nextStep: "plant" | "dashboard") => {
        setCreatedEnvironmentId(envId);
        if (nextStep === "plant") {
            setStep("plant");
        } else {
            closeModal()
        }
    };

    return (
        <div className={styles.multistepContainer}>
            {!isEditMode && (
                <div className={styles.stepIndicator}>
                    <div className={`${styles.stepDot} ${step === "environment" ? styles.active : ""}`}>1</div>
                    <div className={styles.stepLine}></div>
                    <div className={`${styles.stepDot} ${step === "plant" ? styles.active : ""}`}>2</div>
                </div>
            )}
            {step === "environment" ? (
                <>
                    <h2 className={styles.stepTitle}>
                        {!isEditMode ? "Environment erstellen" : "Environment bearbeiten"}
                    </h2>
                    <EnvironmentForm
                        existingId={createdEnvironmentId}
                        onSaved={handleEnvironmentSaved}
                        environmentId={isEditMode ? searchParams.get("editId")! : undefined}
                    />
                </>
            ) : (
                <>
                    <h2 className={styles.stepTitle}>Pflanze hinzufügen</h2>
                    <PlantForm
                        environmentId={createdEnvironmentId}
                        onBack={() => setStep("environment")}
                    />
                </>
            )}
        </div>
    );
};