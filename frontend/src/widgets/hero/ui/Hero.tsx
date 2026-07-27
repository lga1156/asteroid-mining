import illustrationUrl from '../../../assets/cosmo-duck-illustration.png';
import styles from './Hero.module.css';

export function Hero() {
    return (
        <section className={styles.hero}>
            <iframe
                className={styles.starfield}
                src="/src/libs/starfield/index.html?hideStats=true"
                title="Анимированное звёздное небо"
                aria-hidden="true"
                tabIndex={-1}
            />
            <div className={styles.overlay} aria-hidden="true" />
            <div className={styles.inner}>
                <div className={styles.text}>
                    <p className={styles.eyebrow}>Asteroid Mining Corp.</p>
                    <h1 className={styles.title}>Добыча будущего — сегодня</h1>
                    <p className={styles.subtitle}>
                        Соберите план миссии и отправьте флот за редкими ресурсами.
                    </p>
                </div>
                <img className={styles.image} src={illustrationUrl} alt="" />
            </div>
        </section>
    );
}
