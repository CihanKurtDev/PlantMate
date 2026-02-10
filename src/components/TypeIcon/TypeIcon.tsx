import styles from "./TypeIcon.module.scss";
import { LucideIcon } from "lucide-react";

type Props = {
    icon: LucideIcon;
    variant?: string;
    customBgColor?: string;
    customTextColor?: string;
    customBorderColor?: string;
};

const TypeIcon = ({ icon: Icon, variant, customBgColor, customTextColor, customBorderColor }: Props) => {
    const variantClass = variant ? styles[variant.toLowerCase()] : undefined;

    const style =
        !variantClass && (customBgColor || customTextColor || customBorderColor)
            ? {
                  backgroundColor: customBgColor,
                  color: customTextColor,
                  borderColor: customBorderColor,
              }
            : undefined;

    const className = variantClass
        ? `${styles.iconWrapper} ${variantClass}`
        : styles.iconWrapper;

    return (
        <div className={className} style={style}>
            <Icon className={styles.icon} />
        </div>
    );
};

export default TypeIcon;