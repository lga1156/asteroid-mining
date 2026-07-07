import { memo } from 'react';
import styles from './StarfieldBackground.module.css';

interface StarfieldBackgroundProps {
    showStats?: boolean;
}

export const StarfieldBackground = memo(function StarfieldBackground({
    showStats = true,
}: StarfieldBackgroundProps) {
    const src = showStats
        ? '/src/libs/starfield/index.html'
        : '/src/libs/starfield/index.html?hideStats=true';

    return (
        <iframe
            src={src}
            title="Starfield Background Animation"
            className={styles.iframe}
            aria-hidden="true"
        />
    );
});
