"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { EnvironmentForm } from "../../../components/EnvironmentForm/EnvironmentForm";
import { PlantForm } from "../../../components/PlantForm/PlantForm";
import styles from "./MultiStepForm.module.scss";
import { useModal } from "@/context/ModalContext";

const STEP_INFO = {
    environment: {
        number: 1,
        label: "Umgebung anlegen",
        description: "Definiere den Ort, an dem deine Pflanzen wachsen.",
    },
    plant: {
        number: 2,
        label: "Pflanze hinzufügen",
        description: "Optional — du kannst Pflanzen auch später anlegen.",
    },
};

export const MultiStepForm = () => {
    const [step, setStep] = useState<"environment" | "plant">("environment");
    const [createdEnvironmentId, setCreatedEnvironmentId] = useState<string>("");
    const searchParams = useSearchParams();
    const isEditMode = !!searchParams.get("editId");
    const { closeModal } = useModal();

    const handleEnvironmentSaved = (envId: string, nextStep: "plant" | "dashboard") => {
        setCreatedEnvironmentId(envId);
        if (nextStep === "plant") {
            setStep("plant");
        } else {
            closeModal();
        }
    };

    const current = STEP_INFO[step];

    return (
        <div className={styles.multistepContainer}>
            {!isEditMode && (
                <>
                    <div className={styles.stepIndicator}>
                        <div className={`${styles.stepDot} ${step === "environment" ? styles.active : styles.done}`}>1</div>
                        <div className={styles.stepLine} />
                        <div className={`${styles.stepDot} ${step === "plant" ? styles.active : ""}`}>2</div>
                    </div>
                    <div className={styles.stepInfoWrapper}>
                        <p className={styles.stepLabel}>
                            Schritt {current.number} von 2 · {current.label}
                        </p>
                        <p className={styles.stepDescription}>{current.description}</p>
                    </div>
                </>
            )}

            {step === "environment" ? (
                <>
                    {isEditMode && <h2 className={styles.stepTitle}>Environment bearbeiten</h2>}
                    <EnvironmentForm
                        existingId={createdEnvironmentId}
                        onSaved={handleEnvironmentSaved}
                        environmentId={isEditMode ? searchParams.get("editId")! : undefined}
                    />
                </>
            ) : (
                <PlantForm
                    environmentId={createdEnvironmentId}
                    onBack={() => setStep("environment")}
                />
            )}
        </div>
    );
};