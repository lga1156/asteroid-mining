import { Bars, Moon, Sun } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import { NavLink } from 'react-router-dom';

import logoUrl from '../../../assets/logo.svg';
import { useMissionPlanStore } from '../../../features/mission-plan/model/missionPlanStore';
import { useThemeStore } from '../../../features/theme/model/themeStore';
import styles from './AppLayout.module.css';

const NAVIGATION = [
    { label: 'Астероиды', to: '/' },
    { label: 'План миссии', to: '/mission-plan' },
    { label: 'Статус добычи', to: '/mining-status' },
];

export function AppHeader() {
    const planCount = useMissionPlanStore((state) => state.asteroids.length);
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <NavLink className={styles.logoLink} to="/" aria-label="Asteroid Mining Corp.">
                    <img className={styles.logo} src={logoUrl} alt="Asteroid Mining Corp." />
                </NavLink>

                <nav className={styles.navigation} aria-label="Основная навигация">
                    {NAVIGATION.map((item) => (
                        <NavLink
                            key={item.to}
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                            }
                            to={item.to}
                            end={item.to === '/'}
                        >
                            {item.label}
                            {item.to === '/mission-plan' && planCount > 0 ? (
                                <span className={styles.counter}>{planCount}</span>
                            ) : null}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.headerActions}>
                    <Button
                        view="flat"
                        aria-label={
                            theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'
                        }
                        onClick={toggleTheme}
                    >
                        <Icon data={theme === 'light' ? Moon : Sun} />
                    </Button>
                    <details className={styles.mobileMenu}>
                        <summary aria-label="Открыть меню">
                            <Icon data={Bars} />
                        </summary>
                        <nav className={styles.mobileNavigation}>
                            {NAVIGATION.map((item) => (
                                <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                                    {item.label}
                                    {item.to === '/mission-plan' && planCount > 0
                                        ? ` (${planCount})`
                                        : ''}
                                </NavLink>
                            ))}
                        </nav>
                    </details>
                </div>
            </div>
        </header>
    );
}
