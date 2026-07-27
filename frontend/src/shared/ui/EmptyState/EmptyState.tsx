import type { ReactNode } from 'react';

import styles from './EmptyState.module.css';

type EmptyStateProps = {
    action?: ReactNode;
    description: string;
    icon?: ReactNode;
    title: string;
};

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
    return (
        <section className={styles.empty}>
            {icon ? <div className={styles.icon}>{icon}</div> : null}
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            {action}
        </section>
    );
}
