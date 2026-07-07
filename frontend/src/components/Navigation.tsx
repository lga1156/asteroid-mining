import { Bars } from '@gravity-ui/icons';
import { Button, DropdownMenu, Icon } from '@gravity-ui/uikit';

import styles from './Navigation.module.css';

const NAV_ITEMS = [
    { label: 'Астероиды', href: '#asteroids', active: true },
    { label: 'План миссии', href: '#mission-plan' },
    { label: 'Статус добычи', href: '#mining-status' },
];

const DROPDOWN_ITEMS = NAV_ITEMS.map(({ label, href, active }) => ({
    text: label,
    href,
    ...(active ? { selected: true } : {}),
}));

export function Navigation() {
    return (
        <>
            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <Button
                        key={item.href}
                        view="flat"
                        size="m"
                        href={item.href}
                        focused={item.active?.toString()}
                        // @ts-ignore
                        aria-label={item.ariaLabel}
                    >
                        {item.label}
                    </Button>
                ))}
            </nav>
            <div className={styles.dropdown}>
                <DropdownMenu
                    items={DROPDOWN_ITEMS}
                    icon={<Icon data={Bars} size={16} />}
                    defaultSwitcherProps={{ view: 'flat', size: 'm' }}
                />
            </div>
        </>
    );
}
