import { Input } from "@/components/Form/Input";
import { WaterData } from "@/types/plant";

interface WaterInputsProps {
    water?: WaterData;
    onChange: (w: WaterData) => void;
    errors?: {
        ph?: string;
        ec?: string;
        amount?: string;
    };
    warnings?: {
        ph?: string;
        ec?: string;
        amount?: string;
    };
}

export const WaterInputs = ({ water, onChange, errors, warnings }: WaterInputsProps) => {
    const handleChange = (field: "ph" | "ec" | "amount") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === "" ? undefined : { 
            value: Number(e.target.value), 
            unit: field === "amount" ? "ml" : field 
        };

        onChange({
            ...water,
            [field]: val,
        });
    };

    return (
        <>
            <Input
                label="pH-Wert"
                value={water?.ph?.value ?? ""}
                onChange={handleChange("ph")}
                error={errors?.ph}
                warning={warnings?.ph}
            />
            <Input
                label="EC-Wert"
                value={water?.ec?.value ?? ""}
                onChange={handleChange("ec")}
                error={errors?.ec}
                warning={warnings?.ec}
            />
            <Input
                label="Menge (ml)"
                value={water?.amount?.value ?? ""}
                onChange={handleChange("amount")}
                error={errors?.amount}
                warning={warnings?.amount}
            />
        </>
    );
};
