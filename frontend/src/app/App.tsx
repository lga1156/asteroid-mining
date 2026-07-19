import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from '@gravity-ui/uikit';

import { AppLayout } from '../widgets/app-layout/ui/AppLayout';
import { ErrorBoundary } from './ErrorBoundary';
import { AppProviders } from './AppProviders';
import styles from './App.module.css';

const AsteroidsPage = lazy(() => import('../pages/asteroids/ui/AsteroidsPage'));
const MissionPlanPage = lazy(() => import('../pages/mission-plan/ui/MissionPlanPage'));
const MiningStatusPage = lazy(() => import('../pages/mining-status/ui/MiningStatusPage'));

export function App() {
    return (
        <ErrorBoundary>
            <AppProviders>
                <Suspense
                    fallback={
                        <div className={styles.loading}>
                            <Loader size="l" />
                            Загружаем модуль управления…
                        </div>
                    }
                >
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route index element={<AsteroidsPage />} />
                            <Route path="mission-plan" element={<MissionPlanPage />} />
                            <Route path="mining-status" element={<MiningStatusPage />} />
                            <Route path="*" element={<Navigate replace to="/" />} />
                        </Route>
                    </Routes>
                </Suspense>
            </AppProviders>
        </ErrorBoundary>
    );
}
