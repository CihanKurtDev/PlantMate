import { useState } from "react";
import type { ClimateDataInput, ClimateData } from "@/types/environment";
import { convertClimateDataToInput } from "@/helpers/climateConverter";

export const useClimateForm = (initialClimate?: ClimateData) => {
    const [climateInput, setClimateInput] = useState<ClimateDataInput | undefined>(
        convertClimateDataToInput(initialClimate)
    );

    const resetClimateInput = () => setClimateInput(undefined);

    return { climateInput, setClimateInput, resetClimateInput };
};