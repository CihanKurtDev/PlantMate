import { ClimateDataInput, ClimateData } from "@/types/environment";

export const convertClimateInputToData = (input?: ClimateDataInput): ClimateData | undefined => {
    if (!input) return undefined;

    const result: ClimateData = {};

    if (input.temp?.value) {
        const value = parseFloat(input.temp.value);
        if (!isNaN(value)) result.temp = { value, unit: input.temp.unit ?? "°C" };
    }

    if (input.humidity) {
        const value = parseFloat(input.humidity);
        if (!isNaN(value)) result.humidity = { value, unit: "%" };
    }

    if (input.co2) {
        const value = parseFloat(input.co2);
        if (!isNaN(value)) result.co2 = { value, unit: "ppm" };
    }

    if (input.vpd) {
        const value = parseFloat(input.vpd);
        if (!isNaN(value)) result.vpd = { value, unit: "kPa" };
    }

    return Object.keys(result).length > 0 ? result : undefined;
};

export const convertClimateDataToInput = (data?: ClimateData): ClimateDataInput | undefined => {
    if (!data) return undefined;

    return {
        temp: data.temp ? { value: data.temp.value.toString(), unit: data.temp.unit } : undefined,
        humidity: data.humidity?.value.toString(),
        co2: data.co2?.value.toString(),
        vpd: data.vpd?.value.toString(),
    };
};
