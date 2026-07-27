import type { ReactNode } from 'react';

import styles from './PageTitle.module.css';

type PageTitleProps = {
    actions?: ReactNode;
    children: ReactNode;
    description?: ReactNode;
};

export function PageTitle({ actions, children, description }: PageTitleProps) {
    return (
        <header className={styles.header}>
            <div>
                <h1 className={styles.title}>{children}</h1>
                {description ? <p className={styles.description}>{description}</p> : null}
            </div>
            {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
    );
}
