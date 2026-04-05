import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { ClimateDataInput, TempUnit } from "@/types/environment";

interface ClimateInputsProps {
    climate?: ClimateDataInput;
    onChange: (c: ClimateDataInput) => void;
    errors?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
    warnings?: { temp?: string; humidity?: string; co2?: string; vpd?: string };
}

function convertToCelsius(value: number, unit: TempUnit): number {
    return unit === "°F" ? (value - 32) * (5 / 9) : value;
}

function calculateVPD(tempC: number, humidity: number): number {
    const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
    return svp * (1 - humidity / 100);
}

export const ClimateInputs = ({ climate, onChange, errors, warnings }: ClimateInputsProps) => {
    const safeClimate: ClimateDataInput = climate ?? {};

    const handleValueChange = (field: "temp" | "humidity" | "co2", value: string) => {
        const newClimate: ClimateDataInput = { ...safeClimate };

        if (field === "temp") {
            newClimate.temp = { ...safeClimate.temp, value: value || undefined };
        } else {
            newClimate[field] = value || undefined;
        }

        const tempVal = newClimate.temp?.value ? parseFloat(newClimate.temp.value) : undefined;
        const tempUnit = newClimate.temp?.unit ?? "°C";
        const humidityVal = newClimate.humidity ? parseFloat(newClimate.humidity) : undefined;

        if (tempVal !== undefined && !isNaN(tempVal) && humidityVal !== undefined && !isNaN(humidityVal)) {
            newClimate.vpd = calculateVPD(convertToCelsius(tempVal, tempUnit), humidityVal).toFixed(2);
        } else {
            newClimate.vpd = undefined;
        }

        onChange(newClimate);
    };

    const handleTempUnitChange = (unit: TempUnit) => {
        const newClimate: ClimateDataInput = { ...safeClimate, temp: { ...safeClimate.temp, unit } };

        const tempVal = newClimate.temp?.value ? parseFloat(newClimate.temp.value) : undefined;
        const humidityVal = newClimate.humidity ? parseFloat(newClimate.humidity) : undefined;

        if (tempVal !== undefined && !isNaN(tempVal) && humidityVal !== undefined && !isNaN(humidityVal)) {
            newClimate.vpd = calculateVPD(convertToCelsius(tempVal, unit), humidityVal).toFixed(2);
        } else {
            newClimate.vpd = undefined;
        }

        onChange(newClimate);
    };

    return (
        <>
            <Input
                id="demo-climate-temperature"
                label="Temperatur"
                value={safeClimate.temp?.value ?? ""}
                onChange={(e) => handleValueChange("temp", e.target.value)}
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
                id="demo-climate-humidity"
                label="Luftfeuchtigkeit"
                value={safeClimate.humidity ?? ""}
                onChange={(e) => handleValueChange("humidity", e.target.value)}
                suffix="%"
                error={errors?.humidity}
                warning={warnings?.humidity}
            />

            <Input
                id="demo-climate-co2"
                label="CO₂"
                value={safeClimate.co2 ?? ""}
                onChange={(e) => handleValueChange("co2", e.target.value)}
                suffix="ppm"
                error={errors?.co2}
                warning={warnings?.co2}
            />

            <Input
                label="VPD"
                value={safeClimate.vpd ?? ""}
                suffix="kPa"
                readOnly
                disabled
            />
        </>
    );
};