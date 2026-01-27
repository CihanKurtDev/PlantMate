import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { ClimateData, TempUnit } from "@/types/environment";

interface ClimateInputsProps {
  climate?: ClimateData; 
  onChange: (c: ClimateData) => void;
  errors?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
  warnings?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
}

const getDefaultUnit = (field: keyof ClimateData): string => {
    switch (field) {
        case 'temp': return '°C';
        case 'humidity': return '%';
        case 'co2': return 'ppm';
        case 'vpd': return 'kPa';
        default: return '';
    }
};

export const ClimateInputs = ({ climate, onChange, errors, warnings }: ClimateInputsProps) => {
    const safeClimate: ClimateData = climate ?? {};

    const handleChange = (field: keyof ClimateData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numValue = parseFloat(inputValue);
        
        if (inputValue === "") {
            onChange({
                ...safeClimate,
                [field]: undefined,
            });
            return;
        }
        
        const currentField = safeClimate[field];
        const unit = currentField?.unit ?? getDefaultUnit(field);
        
        onChange({
            ...safeClimate,
            [field]: {
                value: numValue,
                unit: unit,
            },
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
                type="number"
                value={safeClimate.temp?.value ?? ""}
                onChange={handleChange("temp")}
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
                type="number"
                value={safeClimate.humidity?.value ?? ""}
                onChange={handleChange("humidity")}
                suffix="%"
                error={errors?.humidity}
                warning={warnings?.humidity}
            />

            <Input
                label="CO₂"
                type="number"
                value={safeClimate.co2?.value ?? ""}
                onChange={handleChange("co2")}
                suffix="ppm"
                error={errors?.co2}
                warning={warnings?.co2}
            />

            <Input
                label="VPD"
                type="number"
                value={safeClimate.vpd?.value ?? ""}
                onChange={handleChange("vpd")}
                suffix="kPa"
                error={errors?.vpd}
                warning={warnings?.vpd}
            />
        </>
    );
};
