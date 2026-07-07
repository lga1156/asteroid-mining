import logoUrl from '../assets/logo.svg';
import { Navigation } from './Navigation';
import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <a className={styles.logoLink} href="/" aria-label="Asteroid Mining Corp">
                <img src={logoUrl} width={234} height={24} alt="Asteroid Mining Corp." />
            </a>
            <Navigation />
        </header>
    );
}
