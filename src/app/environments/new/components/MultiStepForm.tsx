"use client"

import { useState } from "react";
import { EnvironmentForm } from "./EnvironmentForm";
import { PlantForm } from "./PlantForm";
import styles from "./MultiStepForm.module.scss";
import { PlantData } from "@/types/plant";
import { useRouter } from "next/navigation";
import PlantCard from "../../[environmentId]/components/shared/PlantCard";
import { usePlantMonitor } from "@/context/PlantMonitorContext";

export const MultiStepForm = () => {
    const { getPlantsByEnvironment } = usePlantMonitor();
    const [step, setStep] = useState<"environment" | "plant">("environment");
    const [createdEnvironmentId, setCreatedEnvironmentId] = useState<string>("");
    const plants = getPlantsByEnvironment(createdEnvironmentId);
    const router = useRouter();

    const handleEnvironmentSaved = (envId: string, nextStep: "plant" | "dashboard") => {
        if (nextStep === "plant") {
            setCreatedEnvironmentId(envId);
            setStep("plant");
        } else {
            router.push("/dashboard");
        }
    };

    const stepIndicator = (
        <div className={styles.stepIndicator}>
            <div className={`${styles.stepDot} ${step === "environment" ? styles.active : ""}`}>1</div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.stepDot} ${step === "plant" ? styles.active : ""}`}>2</div>
        </div>
    );


    const initialPlantData: PlantData = {
        id: crypto.randomUUID(),
        title: "",
        species: "",
        environmentId: createdEnvironmentId
    };

    return (
        <div className={styles.multistepContainer}>
            {stepIndicator}
            {step === "environment" ? (
                <>
                    <h2 className={styles.stepTitle}>Environment erstellen</h2>
                    <EnvironmentForm onSaved={handleEnvironmentSaved} />
                </>
            ) : (
                <>
                    <h2 className={styles.stepTitle}>Pflanze erstellen</h2>
                    <PlantForm initialData={initialPlantData} />
                    {plants?.map(plant => <PlantCard key={plant.id} plant={plant}/>)}
                </>
            )}
        </div>
    );
};
