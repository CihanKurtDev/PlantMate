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
    hideAmountInput?: boolean;
}

export const WaterInputs = ({ water, onChange, errors, warnings, hideAmountInput = false }: WaterInputsProps) => {
    const handleChange = (field: "ph" | "ec" | "amount") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numValue = parseFloat(inputValue);
        
        if (inputValue === "") {
            onChange({
                ...water,
                [field]: undefined,
            });
            return;
        }
        
        const getUnit = () => {
            switch (field) {
                case 'ph': return 'pH';
                case 'ec': return 'mS/cm';
                case 'amount': return 'ml';
            }
        };

        onChange({
            ...water,
            [field]: {
                value: numValue,
                unit: getUnit(),
            },
        });
    };

    return (
        <>
            <Input
                label="pH-Wert"
                type="number"
                value={water?.ph?.value ?? ""}
                onChange={handleChange("ph")}
                error={errors?.ph}
                warning={warnings?.ph}
            />
            <Input
                label="EC-Wert"
                type="number"
                value={water?.ec?.value ?? ""}
                onChange={handleChange("ec")}
                error={errors?.ec}
                warning={warnings?.ec}
            />
            {!hideAmountInput && <Input
                label="Menge"
                type="number"
                value={water?.amount?.value ?? ""}
                onChange={handleChange("amount")}
                error={errors?.amount}
                warning={warnings?.amount}
            />}
        </>
    );
};
