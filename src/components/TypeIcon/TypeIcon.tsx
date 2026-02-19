import styles from "./TypeIcon.module.scss";
import { LucideIcon } from "lucide-react";
import { getIconConfig } from "@/config/icons";

const ICON_SIZE_MAP = {
    xs: "16px",
    s: "24px",
    m: "32px",
    l: "40px",
    xl: "48px",
    xxl: "64px",
} as const;

type IconSize = keyof typeof ICON_SIZE_MAP | number | "fill";

interface TypeIconProps {
    icon: LucideIcon;
    variant?: string;
    customBgColor?: string;
    customTextColor?: string;
    customBorderColor?: string;
    size?: IconSize;
}

const TypeIcon = ({
    icon: Icon,
    variant,
    customBgColor,
    customTextColor,
    customBorderColor,
    size,
}: TypeIconProps) => {
    const getIconSize = (): React.CSSProperties | undefined => {
        if (!size || size === "fill") {
            return undefined;
        }

        const sizeValue = typeof size === "number" 
            ? `${size}px` 
            : ICON_SIZE_MAP[size];

        return {
            height: sizeValue,
            width: sizeValue,
        };
    };

    const getStyles = (): React.CSSProperties => {
        if (customBgColor || customTextColor || customBorderColor) {
            return {
                ...getIconSize(),
                backgroundColor: customBgColor,
                color: customTextColor,
                borderColor: customBorderColor,
            };
        }
        if (variant) {
            const config = getIconConfig(variant);
            if (config) {
                return {
                    ...getIconSize(),
                    backgroundColor: config.colors.soft,
                    color: config.colors.base,
                };
            }
        }

        return {
            ...getIconSize(),
        };
    };

    return (
        <div className={styles.iconWrapper} style={getStyles()}>
            <Icon className={size === "fill" ? styles.fill : styles.icon} />
        </div>
    );
};

export default TypeIcon;