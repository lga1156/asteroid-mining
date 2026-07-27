import { Accordion, DefinitionList, Dialog } from '@gravity-ui/uikit';

import type { Asteroid } from '../../../entities/asteroid/model/types';
import { ResourceBadge } from '../../../entities/resource/ui/ResourceBadge';
import { ResourceDetails } from '../../../entities/resource/ui/ResourceDetails';
import styles from './AsteroidDialog.module.css';

type AsteroidDialogProps = {
    asteroid: Asteroid;
    onClose: () => void;
    open: boolean;
};

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
});

export function formatNumber(value: number): string {
    return numberFormatter.format(value);
}

export function AsteroidDialog({ asteroid, onClose, open }: AsteroidDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} size="m" hasCloseButton qa="asteroid-dialog">
            <Dialog.Header caption={asteroid.name} />
            <Dialog.Body className={styles.body}>
                <DefinitionList responsive className={styles.metrics}>
                    <DefinitionList.Item name="Сближение">
                        {dateFormatter.format(new Date(`${asteroid.approachDate}T00:00:00Z`))}
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Диаметр">
                        {formatNumber(asteroid.diameterMeters)} м
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Расстояние">
                        {formatNumber(asteroid.distanceKm)} км ·{' '}
                        {formatNumber(asteroid.distanceLunar)} лунных орбит
                    </DefinitionList.Item>
                </DefinitionList>

                <h3 className={styles.title}>Ресурсы астероида</h3>
                {asteroid.resources.length === 0 ? (
                    <p className={styles.empty}>Ресурсы не найдены</p>
                ) : (
                    <Accordion
                        className={styles.resources}
                        defaultValue={asteroid.resources.map((resource) => resource.id)}
                        multiple
                    >
                        {asteroid.resources.map((resource) => (
                            <Accordion.Item
                                key={resource.id}
                                value={resource.id}
                                summary={
                                    <span className={styles.summary}>
                                        <ResourceBadge resource={resource} />
                                        {resource.name}
                                    </span>
                                }
                            >
                                <div className={styles.details}>
                                    <ResourceDetails resource={resource} />
                                </div>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </Dialog.Body>
        </Dialog>
    );
}
