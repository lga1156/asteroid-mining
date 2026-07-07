import { useEffect, useState } from 'react';

import { fetchAsteroids } from '../api/fetchAsteroids';
import type { Asteroid } from '../types/asteroid';
import { AsteroidList } from './AsteroidList';
import styles from './Main.module.css';

export function AsteroidMainBlock() {
    const [asteroids, setAsteroids] = useState<Asteroid[]>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ignoreResult = false;

        async function loadAsteroids() {
            const nextAsteroids = await fetchAsteroids();

            if (!ignoreResult) {
                setAsteroids(nextAsteroids);
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

    return (
        <section>
            <AsteroidList asteroids={asteroids} />
        </section>
    );
}
