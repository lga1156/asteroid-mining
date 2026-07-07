import illustrationUrl from '../assets/cosmo-duck-illustration.png';
import { StarfieldBackground } from './StarfieldBackground';
import styles from './Hero.module.css';

export function Hero() {
    return (
        <section className={styles.hero}>
            <StarfieldBackground />
            <div className={styles.inner}>
                <div className={styles.text}>
                    <h1 className={styles.title}>Asteroid Mining Corp.</h1>
                    <p className={styles.subtitle}>Добыча будущего сегодня</p>
                </div>
                <div className={styles.imageWrap}>
                    <img className={styles.image} src={illustrationUrl} alt="" />
                </div>
            </div>
        </section>
    );
}
