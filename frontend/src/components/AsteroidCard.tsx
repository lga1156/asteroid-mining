import { useState } from 'react';
import placeholderUrl from '../assets/asteroid-placeholder.svg';
import styles from './AsteroidCard.module.css';
import { Card, DefinitionList } from '@gravity-ui/uikit';
import type { Asteroid } from '../types/asteroid';
import { AsteroidDialog } from './AsteroidDialog';
import { MineAsteroidButton } from './MineAsteroidButton';
import { ResourceIcon } from './ResourceIcon';

interface AsteroidCardProps {
    asteroid: Asteroid;
}

export function AsteroidCard({ asteroid }: AsteroidCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const card = (
        <Card type="container" view="outlined" className={styles.card}>
            <img className={styles.image} src={placeholderUrl} alt="" onClick={openDialog} />
            <h3 className={styles.name} onClick={openDialog}>
                {asteroid.name}
            </h3>
            <div className={styles.content}>
                <DefinitionList responsive={true}>
                    <DefinitionList.Item name="Диаметр">
                        {`${asteroid.diameterMeters} м`}
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Расстояние">
                        {`${asteroid.distanceKm.toLocaleString('ru-RU')} км`}
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Ресурсы">
                        <div className={styles.resources}>
                            {asteroid.resources.map((resource) => (
                                <ResourceIcon key={resource.id} resource={resource} />
                            ))}
                        </div>
                    </DefinitionList.Item>
                </DefinitionList>
                <MineAsteroidButton asteroid={asteroid} />
            </div>
        </Card>
    );

    const dialog = <AsteroidDialog asteroid={asteroid} open={isDialogOpen} onClose={closeDialog} />;

    return (
        <>
            {card}
            {dialog}
        </>
    );
}
