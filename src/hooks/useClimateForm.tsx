import { useState } from "react";
import { ClimateDataInput, EnvironmentData_Historical } from "@/types/environment";
import { convertClimateDataToInput } from "@/helpers/climateConverter";

const EMPTY_CLIMATE_INPUT: ClimateDataInput = {
    temp: { value: "", unit: "°C" },
    humidity: "",
    vpd: "",
    co2: "",
};

export function useClimateForm(existingEntry?: EnvironmentData_Historical) {
    const [climateInput, setClimateInput] = useState<ClimateDataInput>(
        convertClimateDataToInput(existingEntry?.climate) ?? EMPTY_CLIMATE_INPUT
    );

    return { climateInput, setClimateInput };
}