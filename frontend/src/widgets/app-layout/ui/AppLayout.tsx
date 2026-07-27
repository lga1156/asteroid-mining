import { Outlet } from 'react-router-dom';

import { MiningStatusSync } from '../../../features/mining-status/model/MiningStatusSync';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import styles from './AppLayout.module.css';

export function AppLayout() {
    return (
        <div className={styles.app}>
            <MiningStatusSync />
            <AppHeader />
            <div className={styles.main}>
                <Outlet />
            </div>
            <AppFooter />
        </div>
    );
}
