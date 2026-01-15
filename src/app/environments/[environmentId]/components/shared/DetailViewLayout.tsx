"use client";

import { ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { ArrowRight } from "lucide-react";
import styles from './DetailViewLayout.module.scss'
import { useRouter } from "next/navigation";

interface DetailViewLayoutProps {
    backUrl: string;
    backLabel?: string;
    children: ReactNode;
}

const DetailViewLayout = ({ backUrl, backLabel = "Zurück zur Übersicht", children }: DetailViewLayoutProps)  => {
    const router = useRouter()

    return (
        <div className={styles.container}>
            <Button
                size="fill"
                onClick={() => router.push(backUrl)}
            >
                <ArrowRight className={styles.arrow}/>
                {backLabel}
            </Button>
            {children}
        </div>
    );
}

export default DetailViewLayout