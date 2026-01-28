import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { ClimateDataInput, TempUnit } from "@/types/environment";

interface ClimateInputsProps {
  climate?: ClimateDataInput; 
  onChange: (c: ClimateDataInput) => void;
  errors?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
  warnings?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
}

export const ClimateInputs = ({ climate, onChange, errors, warnings }: ClimateInputsProps) => {
    const safeClimate: ClimateDataInput = climate ?? {};

    const handleTempValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...safeClimate,
            temp: {
                value: e.target.value || undefined,
                unit: safeClimate.temp?.unit ?? "°C",
            },
        });
    };

    const handleTempUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({
            ...safeClimate,
            temp: {
                value: safeClimate.temp?.value,
                unit: e.target.value as TempUnit,
            },
        });
    };

    const handleSimpleChange =
        (field: "humidity" | "co2" | "vpd") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...safeClimate,
                [field]: e.target.value || undefined,
            });
        };

    return (
        <>
            <Input
                label="Temperatur"
                value={safeClimate.temp?.value ?? ""}
                onChange={handleTempValueChange}
                suffix={safeClimate.temp?.unit ?? "°C"}
                error={errors?.temp}
                warning={warnings?.temp}
            />
            <Select
                value={safeClimate.temp?.unit ?? "°C"}
                onChange={handleTempUnitChange}
            >
                <option value="°C">°C</option>
                <option value="°F">°F</option>
            </Select>

            <Input
                label="Luftfeuchtigkeit"
                value={safeClimate.humidity ?? ""}
                onChange={handleSimpleChange("humidity")}
                suffix="%"
                error={errors?.humidity}
                warning={warnings?.humidity}
            />

            <Input
                label="CO₂"
                value={safeClimate.co2 ?? ""}
                onChange={handleSimpleChange("co2")}
                suffix="ppm"
                error={errors?.co2}
                warning={warnings?.co2}
            />

            <Input
                label="VPD"
                value={safeClimate.vpd ?? ""}
                onChange={handleSimpleChange("vpd")}
                suffix="kPa"
                error={errors?.vpd}
                warning={warnings?.vpd}
            />
        </>
    );
};
