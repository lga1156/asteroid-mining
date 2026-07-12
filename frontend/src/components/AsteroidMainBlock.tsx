import { useEffect, useState } from 'react';

import { fetchAsteroids } from '../api/fetchAsteroids';
import type { ApiError, Asteroid } from '../types/domain';
import { Alert } from '@gravity-ui/uikit';
import { AsteroidList } from './AsteroidList';
import styles from './Main.module.css';

export function AsteroidMainBlock() {
    const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
    const [error, setError] = useState<ApiError | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ignoreResult = false;

        async function loadAsteroids() {
            const result = await fetchAsteroids();

            if (!ignoreResult) {
                if (result.ok) {
                    setAsteroids(result.data);
                } else {
                    setError(result.error);
                }
                setIsLoading(false);
            }
        }

        loadAsteroids();

        return () => {
            ignoreResult = true;
        };
    }, []);

    if (isLoading) {
        return <p className={styles.status}>Загружаем астероиды...</p>;
    }

    if (error) {
        return (
            <Alert theme="danger" title="Не удалось загрузить астероиды" message={error.error} />
        );
    }

    return (
        <section>
            <AsteroidList asteroids={asteroids} />
        </section>
    );
}
