"use client"

import React, { useState } from "react";
import type { EnvironmentData, EnvironmentType, TempUnit, PercentUnit, KPaUnit } from "@/types/environment";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";
import styles from "./EnvironmentForm.module.scss";
import { useRouter } from "next/navigation";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";

interface EnvironmentFormProps {
    initialData?: EnvironmentData;
    onSaved?: (id: string, nextStep: "plant" | "dashboard") => void;
}

export const EnvironmentForm = ({ initialData, onSaved }: EnvironmentFormProps) => {
    const { addEnvironment } = usePlantMonitor();
    const { validate, validateWarnings } = useEnvironmentValidation();
    const router = useRouter();

    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState<EnvironmentType>(initialData?.type || "ROOM");
    const [location, setLocation] = useState(initialData?.location || "");

    const [temp, setTemp] = useState<number | undefined>(initialData?.climate?.temp?.value);
    const [tempUnit, setTempUnit] = useState<TempUnit>(initialData?.climate?.temp?.unit || "°C");

    const [humidity, setHumidity] = useState<number | undefined>(initialData?.climate?.humidity?.value);
    const [co2, setCo2] = useState<number | undefined>(initialData?.climate?.co2?.value);
    const [vpd, setVpd] = useState<number | undefined>(initialData?.climate?.vpd?.value);

    const [touched, setTouched] = useState({
        name: false,
        type: false,
        location: false,
        temp: false,
        humidity: false,
        co2: false,
        vpd: false,
    });

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();
        setTouched({
            name: true,
            type: true,
            location: true,
            temp: true,
            humidity: true,
            co2: true,
            vpd: true,
        });

        const formData: EnvironmentData = {
            id: initialData?.id || crypto.randomUUID(),
            name,
            type,
            location,
            climate: {
                temp: temp !== undefined ? { value: temp, unit: tempUnit } : undefined,
                humidity: humidity !== undefined ? { value: humidity, unit: "%" as PercentUnit } : undefined,
                co2: co2 !== undefined ? { value: co2, unit: "%" as PercentUnit } : undefined,
                vpd: vpd !== undefined ? { value: vpd, unit: "kPa" as KPaUnit } : undefined,
            },
        };

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) return;

        addEnvironment(formData);

        if (onSaved) {
            onSaved(formData.id, nextStep);
        }

        setName("");
        setType("ROOM");
        setLocation("");
        setTemp(undefined);
        setTempUnit("°C");
        setHumidity(undefined);
        setCo2(undefined);
        setVpd(undefined);
        setTouched({
            name: false,
            type: false,
            location: false,
            temp: false,
            humidity: false,
            co2: false,
            vpd: false,
        });

    };

    const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<number | undefined>>, field: keyof typeof touched) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setter(val === "" ? undefined : parseFloat(val));
            setTouched(prev => ({ ...prev, [field]: true }));
        };

    const formData: EnvironmentData = {
        id: initialData?.id || crypto.randomUUID(),
        name,
        type,
        location,
        climate: {
            temp: temp !== undefined ? { value: temp, unit: tempUnit } : undefined,
            humidity: humidity !== undefined ? { value: humidity, unit: "%" as PercentUnit } : undefined,
            co2: co2 !== undefined ? { value: co2, unit: "%" as PercentUnit } : undefined,
            vpd: vpd !== undefined ? { value: vpd, unit: "kPa" as KPaUnit } : undefined,
        },
    };

    const validationErrors = validate(formData);
    const validationWarnings = validateWarnings(formData);

    const getTempRange = () => tempUnit === "°C" ? { min: 0, max: 40 } : { min: 32, max: 104 };

    return (
        <Form onSubmit={ () => handleSubmit}>
            <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                error={validationErrors.name}
                touched={touched.name}
                required
            />

            <FormField>
                <Select
                    label="Typ"
                    value={type}
                    onChange={(e) => setType(e.target.value as EnvironmentType)}
                    onBlur={() => handleBlur("type")}
                    touched={touched.type}
                    error={validationErrors.type}
                >
                    <option value="ROOM">Room</option>
                    <option value="TENT">Tent</option>
                    <option value="GREENHOUSE">Greenhouse</option>
                </Select>
            </FormField>

            <Input
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => handleBlur("location")}
                error={validationErrors.location}
                touched={touched.location}
                placeholder="z.B. Keller, Wohnzimmer"
            />

            <FormSectionTitle>Klimadaten</FormSectionTitle>

            <div className={styles.row}>
                <Input
                    label="Temperatur"
                    value={temp ?? ""}
                    onChange={handleNumberChange(setTemp, "temp")}
                    onBlur={() => handleBlur("temp")}
                    suffix={tempUnit}
                    type="number"
                    step={0.01}
                    {...getTempRange()}
                    error={validationErrors.climate?.temp}
                    warning={validationWarnings.climate?.temp}
                    touched={touched.temp}
                />
                <Select
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value as TempUnit)}
                    touched={true}
                    className={styles.unitSelect}
                >
                    <option value="°C">°C</option>
                    <option value="F">F</option>
                </Select>
            </div>

            <Input
                label="Luftfeuchtigkeit"
                value={humidity ?? ""}
                onChange={handleNumberChange(setHumidity, "humidity")}
                onBlur={() => handleBlur("humidity")}
                suffix="%"
                type="number"
                step={0.01}
                min={0}
                max={100}
                error={validationErrors.climate?.humidity}
                warning={validationWarnings.climate?.humidity}
                touched={touched.humidity}
            />

            <Input
                label="CO₂"
                value={co2 ?? ""}
                onChange={handleNumberChange(setCo2, "co2")}
                onBlur={() => handleBlur("co2")}
                suffix="ppm"
                type="number"
                step={0.01}
                min={0}
                max={5000}
                error={validationErrors.climate?.co2}
                warning={validationWarnings.climate?.co2}
                touched={touched.co2}
            />

            <Input
                label="VPD"
                value={vpd ?? ""}
                onChange={handleNumberChange(setVpd, "vpd")}
                onBlur={() => handleBlur("vpd")}
                suffix="kPa"
                type="number"
                step={0.01}
                min={0}
                max={10}
                error={validationErrors.climate?.vpd}
                warning={validationWarnings.climate?.vpd}
                touched={touched.vpd}
            />
            <div className={styles.buttonRow}>
                <Button type="button" variant="primary" onClick={(e) => handleSubmit(e, "plant")}>
                    Weiter zu Pflanzen
                </Button>
                <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, "dashboard")}>
                    Zum Dashboard
                </Button>
            </div>
        </Form>
    );
};
