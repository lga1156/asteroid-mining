import { Flex, Link, Text } from '@gravity-ui/uikit';
import logoUrl from '../assets/yy-logo.svg';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
    { label: 'Астероиды', href: '#asteroids' },
    { label: 'План миссии', href: '#mission' },
    { label: 'Статус добычи', href: '#mining-status' },
];

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <nav className={styles.nav}>
                    {FOOTER_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            view="secondary"
                            className={styles.link}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <Flex alignItems="center" gap={4} className={styles.meta}>
                    <Text variant="caption-2" color="secondary">
                        © 2026 Asteroid Mining Corp.
                    </Text>
                    <img src={logoUrl} width={168} height={24} alt="Young & Yandex" />
                </Flex>
            </div>
        </footer>
    );
}
