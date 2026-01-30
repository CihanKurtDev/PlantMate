import type { Dispatch, SetStateAction } from "react";
import { Button } from "../Button/Button";
import styles from './TableCardHeader.module.scss';
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableCardHeaderProps {
    title: string,
    isTableCollapsed: boolean,
    setIsTableCollapsed: Dispatch<SetStateAction<boolean>>,
}

export const TableCardHeader: React.FC<TableCardHeaderProps> = ({title, isTableCollapsed, setIsTableCollapsed}) =>  {
    return (
        <div className={styles.tableCardHeader}>
            <h2>{title}</h2>
            <Button className={styles.openCardButton} onClick={() => setIsTableCollapsed(!isTableCollapsed)}>
                {isTableCollapsed ? <ChevronDown /> : <ChevronUp />}
            </Button>
        </div>
    )
}