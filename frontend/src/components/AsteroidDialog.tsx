import { Accordion, DefinitionList, Dialog } from '@gravity-ui/uikit';

import type { Asteroid, Resource } from '../types/asteroid';
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
    const { mass, volume, volatility, superconductingThreshold } = resource;

    return (
        <DefinitionList responsive>
            <DefinitionList.Item name="Масса">{formatNumber(mass!)}</DefinitionList.Item>
            <DefinitionList.Item name="Объем">{formatNumber(volume!)}</DefinitionList.Item>
            <DefinitionList.Item name="Летучесть">{formatNumber(volatility!)}</DefinitionList.Item>
            <DefinitionList.Item name="Порог сверхпроводимости">
                {formatNumber(superconductingThreshold!)}
            </DefinitionList.Item>
        </DefinitionList>
    );
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
