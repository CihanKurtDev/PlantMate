import { Sprout } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import styles from './GhostCard.module.scss';

interface GhostCardProps {
    title: string;
    text: string;
    cta?: string;
    onClick?: () => void;
}

export function GhostCard({ title, text, cta, onClick }: GhostCardProps) {
    return (
        <div className={styles.ghostOverlayCard}>
            <Sprout size={28} strokeWidth={1.5} aria-hidden />
            <h3 className={styles.ghostOverlayTitle}>{title}</h3>
            <p className={styles.ghostOverlayText}>{text}</p>
            {cta && onClick && (
                <Button variant="secondary" onClick={onClick}>
                    {cta}
                </Button>
            )}
        </div>
    );
}