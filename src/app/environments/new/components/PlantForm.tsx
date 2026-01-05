"use client"

import React, { useState } from "react";
import type { ECUnit, PHUnit, PlantData } from "@/types/plant";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import styles from "./EnvironmentForm.module.scss";
import { useRouter } from "next/navigation";
import { usePlantValidation } from "@/hooks/usePlantValidation";

interface PlantFormProps {
    initialData?: PlantData;
}

export const PlantForm = ({ initialData }: PlantFormProps) => {
    const { addPlant, environments } = usePlantMonitor();
    const { validate, validateWarnings } = usePlantValidation();
    const router = useRouter();

    const [title, setTitle] = useState(initialData?.title || "");
    const [species, setSpecies] = useState(initialData?.species || "");
    const [environmentId, setEnvironmentId] = useState(initialData?.environmentId || "");

    const [ph, setPh] = useState<number | undefined>(initialData?.water?.ph?.value);
    const [ec, setEc] = useState<number | undefined>(initialData?.water?.ec?.value);

    const [touched, setTouched] = useState({
        title: false,
        species: false,
        environmentId: false,
        ph: false,
        ec: false,
    });

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            title: true,
            species: true,
            environmentId: true,
            ph: true,
            ec: true,
        });

        const formData: PlantData = {
            id: initialData?.id || crypto.randomUUID(),
            title,
            species,
            environmentId,
            water: {
                ph: ph !== undefined ? { value: ph, unit: "pH" as PHUnit } : undefined,
                ec: ec !== undefined ? { value: ec, unit: "mS/cm" as ECUnit } : undefined,
            },
        };

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) return;

        addPlant(formData);

        setTitle("");
        setSpecies("");
        setEnvironmentId("");
        setPh(undefined);
        setEc(undefined);
        setTouched({
            title: false,
            species: false,
            environmentId: false,
            ph: false,
            ec: false,
        });

        router.push("/dashboard");
    };

    const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<number | undefined>>, field: keyof typeof touched) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setter(val === "" ? undefined : parseFloat(val));
            setTouched(prev => ({ ...prev, [field]: true }));
        };

    const formData: PlantData = {
        id: initialData?.id || crypto.randomUUID(),
        title,
        species,
        environmentId,
        water: {
            ph: ph !== undefined ? { value: ph, unit: "pH" as PHUnit } : undefined,
            ec: ec !== undefined ? { value: ec, unit: "mS/cm" as ECUnit } : undefined,
        },
    };

    const validationErrors = validate(formData);
    const validationWarnings = validateWarnings(formData);

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input
                label="Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur("title")}
                error={validationErrors.title}
                touched={touched.title}
                required
            />

            <Input
                label="Art/Sorte"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                onBlur={() => handleBlur("species")}
                error={validationErrors.species}
                touched={touched.species}
                placeholder="z.B. Solanum lycopersicum"
            />

            <div className={styles.field}>
                <label className={styles.label}>Environment</label>
                <select
                    value={environmentId}
                    onChange={(e) => setEnvironmentId(e.target.value)}
                    onBlur={() => handleBlur("environmentId")}
                    className={styles.select}
                >
                    <option value="">Bitte wählen...</option>
                    {environments.map(env => (
                        <option key={env.id} value={env.id}>
                            {env.name}
                        </option>
                    ))}
                </select>
                {touched.environmentId && validationErrors.environmentId && (
                    <span className={styles.fieldError}>{validationErrors.environmentId}</span>
                )}
            </div>

            <h3 className={styles.sectionTitle}>Wasserwerte</h3>

            <Input
                label="pH-Wert"
                value={ph ?? ""}
                onChange={handleNumberChange(setPh, "ph")}
                onBlur={() => handleBlur("ph")}
                suffix="pH"
                type="number"
                step={0.01}
                min={0}
                max={14}
                error={validationErrors.water?.ph}
                warning={validationWarnings.water?.ph}
                touched={touched.ph}
            />

            <Input
                label="EC-Wert"
                value={ec ?? ""}
                onChange={handleNumberChange(setEc, "ec")}
                onBlur={() => handleBlur("ec")}
                suffix="mS/cm"
                type="number"
                step={0.01}
                min={0}
                max={10}
                error={validationErrors.water?.ec}
                warning={validationWarnings.water?.ec}
                touched={touched.ec}
            />

            <Button type="submit" variant="primary">
                Speichern
            </Button>
        </form>
    );
};