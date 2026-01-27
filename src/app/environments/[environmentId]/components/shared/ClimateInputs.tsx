import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { ClimateData, TempUnit } from "@/types/environment";

interface ClimateInputsProps {
  climate?: ClimateData; 
  onChange: (c: ClimateData) => void;
  errors?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
  warnings?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
}

export const ClimateInputs = ({ climate, onChange, errors, warnings }: ClimateInputsProps) => {
    const safeClimate: ClimateData = climate ?? {};

    const handleChange = (field: keyof ClimateData) => (val: string) => {
        onChange({
            ...safeClimate,
            [field]:
                val === ""
                    ? undefined
                    : { ...safeClimate[field], value: val },
        });
    };

    const handleTempUnitChange = (newUnit: TempUnit) => {
        if (safeClimate.temp) {
            onChange({ ...safeClimate, temp: { ...safeClimate.temp, unit: newUnit } });
        } else {
            onChange({ ...safeClimate, temp: { value: 0, unit: newUnit } });
        }
    };

    return (
        <>
            <Input
                label="Temperatur"
                value={safeClimate.temp?.value ?? ""}
                onChange={(e) => handleChange("temp")(e.target.value)}
                suffix={safeClimate.temp?.unit ?? "°C"}
                error={errors?.temp}
                warning={warnings?.temp}
            />
            <Select
                value={safeClimate.temp?.unit ?? "°C"}
                onChange={(e) => handleTempUnitChange(e.target.value as TempUnit)}
            >
                <option value="°C">°C</option>
                <option value="°F">°F</option>
            </Select>

            <Input
                label="Luftfeuchtigkeit"
                value={safeClimate.humidity?.value ?? ""}
                onChange={(e) => handleChange("humidity")(e.target.value)}
                suffix="%"
                error={errors?.humidity}
                warning={warnings?.humidity}
            />

            <Input
                label="CO₂"
                value={safeClimate.co2?.value ?? ""}
                onChange={(e) => handleChange("co2")(e.target.value)}
                suffix="ppm"
                error={errors?.co2}
                warning={warnings?.co2}
            />

            <Input
                label="VPD"
                value={safeClimate.vpd?.value ?? ""}
                onChange={(e) => handleChange("vpd")(e.target.value)}
                suffix="kPa"
                error={errors?.vpd}
                warning={warnings?.vpd}
            />
        </>
    );
};
