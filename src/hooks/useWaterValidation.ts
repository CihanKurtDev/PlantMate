import { useMemo } from "react";
import { WaterData } from "@/types/plant";

export interface WaterErrors {
  ph?: string;
  ec?: string;
  amount?: string;
}

export interface WaterWarnings {
  ph?: string;
  ec?: string;
  amount?: string;
}

export const useWaterValidation = (water?: WaterData) => {
    const errors: WaterErrors = useMemo(() => {
        const errs: WaterErrors = {};

        if (water?.ph?.value !== undefined) {
            if (isNaN(water.ph.value)) {
                errs.ph = "Bitte eine Zahl eingeben";
            } else if (water.ph.value < 0 || water.ph.value > 14) {
                errs.ph = "pH-Wert muss zwischen 0 und 14 liegen";
            }
        }

        if (water?.ec?.value !== undefined) {
            if (isNaN(water.ec.value)) {
                errs.ec = "Bitte eine Zahl eingeben";
            } else if (water.ec.value < 0 || water.ec.value > 10) {
                errs.ec = "EC-Wert muss zwischen 0 und 10 liegen";
            }
        }

        if (water?.amount?.value !== undefined) {
            if (isNaN(water.amount.value)) {
                errs.amount = "Bitte eine Zahl eingeben";
            } else if (water.amount.value <= 0) {
                errs.amount = "Menge muss größer als 0 sein";
            } else if (water.amount.value > 100000) {
                errs.amount = "Menge unrealistisch hoch";
            }
        }

        return errs;
    }, [water]);

    const warnings: WaterWarnings = useMemo(() => {
        const warn: WaterWarnings = {};

        if (!errors.ph && water?.ph?.value !== undefined && !isNaN(water.ph.value)) {
            if (water.ph.value < 5.5) warn.ph = "pH-Wert sehr niedrig: Nährstoffaufnahme beeinträchtigt";
            else if (water.ph.value > 7.5) warn.ph = "pH-Wert sehr hoch: Mikronährstoffmangel möglich";
        }

        if (!errors.ec && water?.ec?.value !== undefined && !isNaN(water.ec.value)) {
            if (water.ec.value < 0.5) warn.ec = "EC-Wert sehr niedrig: Nährstoffmangel";
            else if (water.ec.value > 3.5) warn.ec = "EC-Wert sehr hoch: Gefahr von Nährstoffverbrennung";
        }

        if (!errors.amount && water?.amount?.value !== undefined && !isNaN(water.amount.value)) {
            if (water.amount.value < 50) {
                warn.amount = "Sehr geringe Wassermenge";
            } else if (water.amount.value > 5000) {
                warn.amount = "Große Wassermenge – Pflanze nicht überwässern";
            }
        }

        return warn;
    }, [water, errors]);

    return { errors, warnings };
};
