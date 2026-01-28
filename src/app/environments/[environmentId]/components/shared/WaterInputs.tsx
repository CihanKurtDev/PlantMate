import { Input } from "@/components/Form/Input";
import { WaterDataInput } from "@/types/plant";

interface WaterInputsProps {
    water?: WaterDataInput;
    onChange: (w: WaterDataInput) => void;
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
    hideAmountInput?: boolean;
}

export const WaterInputs = ({ water, onChange, errors, warnings, hideAmountInput = false }: WaterInputsProps) => {
    const handleChange = (field: "ph" | "ec" | "amount") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        onChange({
            ...water,
            [field]: inputValue === "" ? undefined : inputValue,
        });
    };

    return (
        <>
            <Input
                label="pH-Wert"
                type="text"
                value={water?.ph ?? ""}
                onChange={handleChange("ph")}
                error={errors?.ph}
                warning={warnings?.ph}
            />
            <Input
                label="EC-Wert"
                type="text"
                value={water?.ec ?? ""}
                onChange={handleChange("ec")}
                error={errors?.ec}
                warning={warnings?.ec}
            />
            {!hideAmountInput && (
                <Input
                    label="Menge"
                    type="text"
                    value={water?.amount ?? ""}
                    onChange={handleChange("amount")}
                    error={errors?.amount}
                    warning={warnings?.amount}
                />
            )}
        </>
    );
};