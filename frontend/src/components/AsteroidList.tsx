import type { Asteroid } from '../types/asteroid';
import { AsteroidCard } from './AsteroidCard';
import styles from './AsteroidList.module.css';

interface AsteroidListProps {
    asteroids: Asteroid[];
}

export function AsteroidList({ asteroids }: AsteroidListProps) {
    return (
        <div className={styles.cards}>
            {asteroids.map((asteroid) => (
                // eslint-disable-next-line react/jsx-key
                <AsteroidCard asteroid={asteroid} />
            ))}
        </div>
    );
}
