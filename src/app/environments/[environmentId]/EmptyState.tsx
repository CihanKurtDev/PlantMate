import styles from './EmptyState.module.scss'

export default function EmptyState({message}: {message: string}){
    return (
        <div className={styles.emptyState}>{message}</div>
    )
}