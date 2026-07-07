import { Plus } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import { useState } from 'react';

import { mineAsteroid } from '../api/mineAsteroid';
import type { Asteroid } from '../types/asteroid';
import styles from './AsteroidCard.module.css';

interface MineAsteroidButtonProps {
    asteroid: Asteroid;
}

export function MineAsteroidButton({ asteroid }: MineAsteroidButtonProps) {
    const [isMining, setIsMining] = useState(false);

    const handleClick = async () => {
        setIsMining(true);

        try {
            await mineAsteroid({ asteroids: [asteroid.name] });
        } finally {
            setIsMining(false);
        }
    };

    return (
        <Button
            view="normal"
            size="m"
            className={styles.addButton}
            loading={isMining}
            onClick={handleClick}
        >
            <Icon data={Plus} size={12.5} />
            Добыть
        </Button>
    );
}
