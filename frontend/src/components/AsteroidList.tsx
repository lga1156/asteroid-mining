import type { Asteroid } from '../types/domain';
import { AsteroidCard } from './AsteroidCard';
import styles from './AsteroidList.module.css';

interface AsteroidListProps {
    asteroids: Asteroid[];
}

export function AsteroidList({ asteroids }: AsteroidListProps) {
    return (
        <div className={styles.cards}>
            {asteroids.map((asteroid) => (
                <AsteroidCard key={asteroid.id} asteroid={asteroid} />
            ))}
        </div>
    );
}
