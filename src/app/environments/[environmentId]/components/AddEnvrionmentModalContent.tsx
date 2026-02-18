"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentData_Historical } from "@/types/environment";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import DatePicker from "./shared/DatePicker";
import styles from "./AddEnvironmentModalContent.module.scss";
import EnvironmentEventForm from "./EnvironmentEventForm";

interface AddEnvironmentModalContentProps {
    environmentId: string;
    onClose: () => void;
}

function ClimateForm({ environmentId, onClose }: { environmentId: string; onClose: () => void }) {
    const { addHistoryData } = usePlantMonitor();
    const [timestamp, setTimestamp] = useState(Date.now());
    const [temp, setTemp]           = useState("");
    const [humidity, setHumidity]   = useState("");
    const [co2, setCo2]             = useState("");
    const [vpd, setVpd]             = useState("");

    const handleSubmit = (formEvent: React.FormEvent) => {
        formEvent.preventDefault();

        if (!temp && !humidity && !co2 && !vpd) {
            alert("Bitte trage mindestens einen Messwert ein.");
            return;
        }

        const entry: EnvironmentData_Historical = {
            id: Date.now().toString(),
            environmentId,
            timestamp,
            climate: {
                ...(temp     && { temp:     { value: parseFloat(temp),     unit: "°C"  } }),
                ...(humidity && { humidity: { value: parseFloat(humidity), unit: "%"   } }),
                ...(co2      && { co2:      { value: parseFloat(co2),      unit: "ppm" } }),
                ...(vpd      && { vpd:      { value: parseFloat(vpd),      unit: "kPa" } }),
            },
        };

        addHistoryData(environmentId, entry);
        onClose();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Klimamessung eintragen</FormSectionTitle>
            <FormField>
                <DatePicker value={timestamp} onChange={setTimestamp} label="Datum & Uhrzeit" />
            </FormField>
            <FormField>
                <label htmlFor="hist-temp">Temperatur (°C)</label>
                <input id="hist-temp" type="number" step="0.1" value={temp}
                    onChange={e => setTemp(e.target.value)} placeholder="z.B. 24.5" />
            </FormField>
            <FormField>
                <label htmlFor="hist-humidity">Luftfeuchtigkeit (%)</label>
                <input id="hist-humidity" type="number" step="0.1" min="0" max="100" value={humidity}
                    onChange={e => setHumidity(e.target.value)} placeholder="z.B. 65" />
            </FormField>
            <FormField>
                <label htmlFor="hist-co2">CO₂ (ppm)</label>
                <input id="hist-co2" type="number" step="1" value={co2}
                    onChange={e => setCo2(e.target.value)} placeholder="z.B. 800" />
            </FormField>
            <FormField>
                <label htmlFor="hist-vpd">VPD (kPa)</label>
                <input id="hist-vpd" type="number" step="0.01" value={vpd}
                    onChange={e => setVpd(e.target.value)} placeholder="z.B. 1.2" />
            </FormField>
            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={onClose}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}

export default function AddEnvironmentModalContent({ environmentId, onClose }: AddEnvironmentModalContentProps) {
    const [tab, setTab] = useState<"messung" | "ereignis">("messung");

    return (
        <>
            <div className={styles.tabs}>
                <Button
                    style={{width: "100%", border: "none"}}
                    isActive={tab === "messung"}
                    onClick={() => setTab("messung")}
                >
                    📊 Klimamessung
                </Button>
                <Button
                    style={{width: "100%"}}
                    isActive={tab === "ereignis"}
                    onClick={() => setTab("ereignis")}
                >
                    📋 Ereignis
                </Button>
            </div>

            {tab === "messung" && (
                <ClimateForm environmentId={environmentId} onClose={onClose} />
            )}
            {tab === "ereignis" && (
                <EnvironmentEventForm environmentId={environmentId} onCancel={onClose} />
            )}
        </>
    );
}