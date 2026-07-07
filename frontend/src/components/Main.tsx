import { AsteroidMainBlock } from './AsteroidMainBlock';
import { Hero } from './Hero';
import styles from './Main.module.css';

export function Main() {
    return (
        <>
            <Hero />
            <div className={styles.app}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Астероиды</h2>
                    <AsteroidMainBlock />
                </div>
            </div>
        </>
    );
}
