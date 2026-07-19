import type { Asteroid } from '../../../entities/asteroid/model/types';
import { AsteroidCard } from './AsteroidCard';
import styles from './AsteroidList.module.css';

type AsteroidListProps = {
    asteroids: Asteroid[];
};

export function AsteroidList({ asteroids }: AsteroidListProps) {
    return (
        <div className={styles.grid}>
            {asteroids.map((asteroid) => (
                <AsteroidCard key={asteroid.id} asteroid={asteroid} />
            ))}
        </div>
    );
}
