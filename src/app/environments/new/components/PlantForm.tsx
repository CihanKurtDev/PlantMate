"use client"

import type { ECUnit, PHUnit, PlantData } from "@/types/plant";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { useRouter } from "next/navigation";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useState } from "react";

interface PlantFormProps {
    initialData?: PlantData; 
}

export const PlantForm = ({ initialData  }: PlantFormProps) => {
    const { addPlant, environments } = usePlantMonitor();
    const { validate, validateWarnings } = usePlantValidation();
    const { formState, setField, setTouchedField, resetForm } = usePlantForm(initialData);
    const router = useRouter();
    const isEditing = !!initialData;
    const [amount, setAmount] = useState<number>(1);

    const handleBlur = (field: keyof typeof formState.touched) => {
        setTouchedField(field, true);
    };

    const handleSubmitWithoutNav = (e: React.FormEvent) => {
        e.preventDefault();
        
        Object.keys(formState.touched).forEach(key => setTouchedField(key as keyof typeof formState.touched, true));
       
        const formData: PlantData = {
            id: formState.plantId ?? crypto.randomUUID(),
            title: formState.title,
            species: formState.species,
            environmentId: formState.environmentId,
            water: {
                ph: formState.ph !== undefined ? { value: formState.ph, unit: "pH" as PHUnit } : undefined,
                ec: formState.ec !== undefined ? { value: formState.ec, unit: "mS/cm" as ECUnit } : undefined,
            },
        };

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) return;

        for(let i = 0; i<= amount; i++) {
            const newPlant: PlantData = {
                ...formData,
                id: crypto.randomUUID(),
            };
            addPlant(newPlant);
        }
        resetForm()
    }

    const handleSubmit = (e: React.FormEvent) => {
        handleSubmitWithoutNav(e)
        router.push("/dashboard");
    };

    const handleNumberChange = (field: "ph" | "ec") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setField(field, val === "" ? undefined : parseFloat(val))
            setTouchedField(field, true);
        };

    const formData: PlantData = {
        id: formState.plantId,
        title: formState.title,
        species: formState.species,
        environmentId: formState.environmentId,
        water: {
            ph: formState.ph !== undefined ? { value: formState.ph, unit: "pH" as PHUnit } : undefined,
            ec: formState.ec !== undefined ? { value: formState.ec, unit: "mS/cm" as ECUnit } : undefined,
        },
    };

    const validationErrors = validate(formData);
    const validationWarnings = validateWarnings(formData);

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Name"
                value={formState.title}
                onChange={(e) => setField("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                error={validationErrors.title}
                touched={formState.touched.title}
                required
            />

            <Input
                label="Art/Sorte"
                value={formState.species}
                onChange={(e) => setField("species", e.target.value)}
                onBlur={() => handleBlur("species")}
                error={validationErrors.species}
                touched={formState.touched.species}
                placeholder="z.B. Solanum lycopersicum"
            />

            <FormField>
                <Select
                    label="Environment"
                    value={formState.environmentId}
                    onChange={(e) => setField("environmentId", e.target.value)}
                    onBlur={() => handleBlur("environmentId")}
                    touched={formState.touched.environmentId}
                    error={validationErrors.environmentId}
                >
                    <option value="">Bitte wählen...</option>
                    {environments.map(env => (
                        <option key={env.id} value={env.id}>
                            {env.name}
                        </option>
                    ))}
                </Select>
            </FormField>

            <FormSectionTitle>Wasserwerte</FormSectionTitle>

            <Input
                label="pH-Wert"
                value={formState.ph ?? ""}
                onChange={handleNumberChange("ph")}
                onBlur={() => handleBlur("ph")}
                suffix="pH"
                type="number"
                step={0.1}
                min={0}
                max={14}
                error={validationErrors.water?.ph}
                warning={validationWarnings.water?.ph}
                touched={formState.touched.ph}
            />

            <Input
                label="EC-Wert"
                value={formState.ec ?? ""}
                onChange={handleNumberChange( "ec")}
                onBlur={() => handleBlur("ec")}
                suffix="mS/cm"
                type="number"
                step={0.1}
                min={0}
                max={10}
                error={validationErrors.water?.ec}
                warning={validationWarnings.water?.ec}
                touched={formState.touched.ec}
            />

            <Input
                label="Menge"
                value={amount ?? 0}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                type="number"
                step={1}
                min={1}
                max={10}
            />

            <div>
                {!!isEditing && <Button type="button" variant="secondary" onClick={handleSubmitWithoutNav}>
                    Speichern & Weiter
                </Button>}
                <Button type="button" variant="primary" onClick={handleSubmit}>
                    Speichern & Zum Dashboard
                </Button>
            </div>
        </Form>
    );
};