import type { Dispatch, SetStateAction } from "react";
import styles from './TableCardHeader.module.scss';
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableCardHeaderProps {
    title: string,
    isTableCollapsed: boolean,
    setIsTableCollapsed: Dispatch<SetStateAction<boolean>>,
}

export const TableCardHeader: React.FC<TableCardHeaderProps> = ({title, isTableCollapsed, setIsTableCollapsed}) =>  {
    return (
        <div className={styles.tableCardHeader} onClick={() => setIsTableCollapsed(!isTableCollapsed)}>
            <h2>{title}</h2>
            {isTableCollapsed ? <ChevronDown /> : <ChevronUp />}
        </div>
    )
}