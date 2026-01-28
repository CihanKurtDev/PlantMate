import { WaterDataInput, WaterData } from "@/types/plant";

export const convertWaterInputToData = (input?: WaterDataInput): WaterData | undefined => {
    if (!input) return undefined;

    const result: WaterData = {};

    if (input.ph) {
        const value = parseFloat(input.ph);
        if (!isNaN(value)) {
            result.ph = { value, unit: 'pH' };
        }
    }

    if (input.ec) {
        const value = parseFloat(input.ec);
        if (!isNaN(value)) {
            result.ec = { value, unit: 'mS/cm' };
        }
    }

    if (input.amount) {
        const value = parseFloat(input.amount);
        if (!isNaN(value)) {
            result.amount = { value, unit: 'ml' };
        }
    }

    return Object.keys(result).length > 0 ? result : undefined;
};

export const convertWaterDataToInput = (data?: WaterData): WaterDataInput | undefined => {
    if (!data) return undefined;

    return {
        ph: data.ph?.value.toString(),
        ec: data.ec?.value.toString(),
        amount: data.amount?.value.toString(),
    };
};