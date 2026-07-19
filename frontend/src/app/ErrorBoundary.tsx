import { Button } from '@gravity-ui/uikit';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import styles from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public override state: ErrorBoundaryState = { hasError: false };

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public override componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Unhandled application error', error, info);
    }

    public override render() {
        if (this.state.hasError) {
            return (
                <main className={styles.error}>
                    <div>
                        <p className={styles.code}>500</p>
                        <h1>Навигационный компьютер дал сбой</h1>
                        <p>Перезагрузите приложение — сохранённый план миссии не потеряется.</p>
                        <Button view="action" size="l" onClick={() => window.location.reload()}>
                            Перезагрузить
                        </Button>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
