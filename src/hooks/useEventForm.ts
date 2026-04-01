import { useMemo, useState } from "react";
import { EventFormData, EventTypeConfig } from "@/types/events";


function buildInitialExtra(
    config: EventTypeConfig
): Record<string, string | number | undefined> {
    const fields = config.extraFields ?? [];

    return Object.fromEntries(
        fields
            .filter((field) => field.defaultValue !== undefined)
            .map((field) => [field.key, field.defaultValue])
    );
}

function buildInitialFormData(
    defaultEventType: string,
    configList: EventTypeConfig[],
): EventFormData {
    const activeConfig = configList.find((c) => c.value === defaultEventType);

    return {
        type: defaultEventType,
        timestamp: Date.now(),
        notes: "",
        extra: activeConfig ? buildInitialExtra(activeConfig) : {},
    };
}


export function useEventForm(defaultEventType: string, configList: EventTypeConfig[]) {
    const [formData, setFormData] = useState<EventFormData>(() =>
        buildInitialFormData(defaultEventType, configList)
    );

    const activeConfig = useMemo(
        () => configList.find((c) => c.value === formData.type),
        [configList, formData.type]
    );


    const setType = (newType: string) => {
        const newConfig = configList.find((c) => c.value === newType);

        setFormData((prev) => ({
            ...prev,
            type: newType,
            extra: newConfig ? buildInitialExtra(newConfig) : {},
        }));
    };

    const setTimestamp = (timestamp: number) => {
        setFormData((prev) => ({ ...prev, timestamp }));
    };

    const setNotes = (notes: string) => {
        setFormData((prev) => ({ ...prev, notes }));
    };

    const setExtra = (key: string, value: string | number | undefined) => {
        setFormData((prev) => ({
            ...prev,
            extra: { ...prev.extra, [key]: value },
        }));
    };


    return {
        formData,
        activeConfig,
        setType,
        setTimestamp,
        setNotes,
        setExtra,
    };
}