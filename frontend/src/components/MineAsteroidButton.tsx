import { Plus } from '@gravity-ui/icons';
import { Alert, Button, Icon } from '@gravity-ui/uikit';
import { useState } from 'react';

import { mineAsteroid } from '../api/mineAsteroid';
import type { ApiError, Asteroid } from '../types/domain';
import styles from './AsteroidCard.module.css';

interface MineAsteroidButtonProps {
    asteroid: Asteroid;
}

export function MineAsteroidButton({ asteroid }: MineAsteroidButtonProps) {
    const [isMining, setIsMining] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [isDone, setIsDone] = useState(false);

    const handleClick = async () => {
        setIsMining(true);
        setError(null);
        setIsDone(false);

        const result = await mineAsteroid({ asteroids: [asteroid.id] });
        if (result.ok) {
            setIsDone(true);
        } else {
            setError(result.error);
        }
        setIsMining(false);
    };

    return (
        <>
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
            {error && (
                <Alert theme="danger" title="Не удалось начать добычу" message={error.error} />
            )}
            {isDone && <Alert theme="success" title="Миссия отправлена" />}
        </>
    );
}
