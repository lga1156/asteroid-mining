import { useState } from 'react';
import { Card, Label } from '@gravity-ui/uikit';

import asteroidPlaceholder from '../../../assets/asteroid-placeholder.svg';
import { getAsteroidImageVariant } from '../../../entities/asteroid/lib/asteroidMeta';
import type { Asteroid } from '../../../entities/asteroid/model/types';
import { ResourceBadge } from '../../../entities/resource/ui/ResourceBadge';
import { AsteroidDialog } from '../../../features/asteroid-details/ui/AsteroidDialog';
import { AddToPlanButton } from '../../../features/mission-plan/ui/AddToPlanButton';
import styles from './AsteroidCard.module.css';

type AsteroidCardProps = {
    asteroid: Asteroid;
};

const STATUS_PROPS = {
    active: { label: 'Добывается', theme: 'warning' },
    available: { label: 'Доступен', theme: 'success' },
    done: { label: 'Добыт', theme: 'normal' },
} as const;

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

export function AsteroidCard({ asteroid }: AsteroidCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const status = STATUS_PROPS[asteroid.status];

    return (
        <>
            <Card
                className={styles.card}
                type="container"
                view="outlined"
                data-testid="asteroid-card"
            >
                <button
                    className={styles.preview}
                    data-variant={getAsteroidImageVariant(asteroid.id)}
                    type="button"
                    aria-label={`Подробнее об астероиде ${asteroid.name}`}
                    onClick={() => setIsDialogOpen(true)}
                >
                    <img className={styles.image} src={asteroidPlaceholder} alt="" />
                    <Label className={styles.status} theme={status.theme} size="xs">
                        {status.label}
                    </Label>
                </button>
                <div className={styles.content}>
                    <button
                        className={styles.titleButton}
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <h3 className={styles.title}>{asteroid.name}</h3>
                    </button>
                    <dl className={styles.metrics}>
                        <div>
                            <dt>Диаметр</dt>
                            <dd>{numberFormatter.format(asteroid.diameterMeters)} м</dd>
                        </div>
                        <div>
                            <dt>Расстояние</dt>
                            <dd>{numberFormatter.format(asteroid.distanceKm)} км</dd>
                        </div>
                    </dl>
                    <div className={styles.resources} aria-label="Ресурсы">
                        {asteroid.resources.map((resource) => (
                            <ResourceBadge key={resource.id} resource={resource} />
                        ))}
                    </div>
                    <AddToPlanButton asteroid={asteroid} />
                </div>
            </Card>
            <AsteroidDialog
                asteroid={asteroid}
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
}
