import { Link } from 'react-router-dom';

import yyLogoUrl from '../../../assets/yy-logo.svg';
import styles from './AppLayout.module.css';

export function AppFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <span>© 2026 Asteroid Mining Corp.</span>
                <nav className={styles.footerNav} aria-label="Навигация в подвале">
                    <Link to="/">Астероиды</Link>
                    <Link to="/mission-plan">План миссии</Link>
                    <Link to="/mining-status">Статус добычи</Link>
                </nav>
                <img src={yyLogoUrl} width="140" height="20" alt="Young & Yandex" />
            </div>
        </footer>
    );
}
