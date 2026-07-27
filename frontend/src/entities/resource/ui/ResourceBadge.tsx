import { Label } from '@gravity-ui/uikit';

import type { AsteroidResource } from '../../asteroid/model/types';
import { getResourceKindLabel } from '../model/aggregateResources';
import styles from './ResourceBadge.module.css';

type ResourceBadgeProps = {
    resource: AsteroidResource;
    showName?: boolean;
};

const RESOURCE_THEMES = {
    gas: 'info',
    liquid: 'warning',
    mineral: 'utility',
} as const;

export function ResourceBadge({ resource, showName = false }: ResourceBadgeProps) {
    return (
        <Label
            className={styles.badge}
            size="xs"
            theme={RESOURCE_THEMES[resource.kind]}
            title={`${resource.name} · ${getResourceKindLabel(resource.kind)}`}
        >
            <span className={styles.symbol}>{resource.symbol}</span>
            {showName ? resource.name : null}
        </Label>
    );
}
