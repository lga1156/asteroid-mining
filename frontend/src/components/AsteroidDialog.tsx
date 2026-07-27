import { Accordion, DefinitionList, Dialog } from '@gravity-ui/uikit';

import type { Asteroid, Resource } from '../types/domain';
import styles from './AsteroidDialog.module.css';
import { ResourceIcon } from './ResourceIcon';

interface AsteroidDialogProps {
    asteroid: Asteroid;
    open: boolean;
    onClose: () => void;
}

const numberFormatter = new Intl.NumberFormat('ru-RU');

function formatNumber(value: number) {
    return numberFormatter.format(value);
}

function ResourceDefinitionList({ resource }: { resource: Resource }) {
    switch (resource.kind) {
        case 'mineral':
            return (
                <DefinitionList responsive>
                    <DefinitionList.Item name="Масса">
                        {formatNumber(resource.mass)} т
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Порог сверхпроводимости">
                        {formatNumber(resource.superconductingThreshold)} К
                    </DefinitionList.Item>
                </DefinitionList>
            );
        case 'liquid':
            return (
                <DefinitionList responsive>
                    <DefinitionList.Item name="Объем">
                        {formatNumber(resource.volume)} л
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Давление испарения">
                        {formatNumber(resource.volatility)} Па
                    </DefinitionList.Item>
                </DefinitionList>
            );
        case 'gas':
            return (
                <DefinitionList responsive>
                    <DefinitionList.Item name="Объем">
                        {formatNumber(resource.volume)} м³
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Давление разложения">
                        {formatNumber(resource.volatility)} Па
                    </DefinitionList.Item>
                </DefinitionList>
            );
    }
}

export function AsteroidDialog({ asteroid, open, onClose }: AsteroidDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} size="m" hasCloseButton={true}>
            <Dialog.Header caption={asteroid.name} />
            <Dialog.Body className={styles.body}>
                {asteroid.resources.length > 0 ? (
                    <Accordion
                        multiple={true}
                        defaultValue={asteroid.resources.map((resource) => resource.id)}
                        className={styles.resources}
                    >
                        {asteroid.resources.map((resource) => (
                            <Accordion.Item
                                key={resource.id}
                                value={resource.id}
                                summary={
                                    <span className={styles.resourceSummary}>
                                        <ResourceIcon resource={resource} />
                                        {resource.name}
                                    </span>
                                }
                            >
                                <div className={styles.resourceDetails}>
                                    <ResourceDefinitionList resource={resource} />
                                </div>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <p className={styles.empty}>Ресурсы не найдены</p>
                )}
            </Dialog.Body>
        </Dialog>
    );
}
