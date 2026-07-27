import { Card } from '@gravity-ui/uikit';

import type { Asteroid } from '../../../entities/asteroid/model/types';
import {
    aggregateResources,
    formatResourceAmount,
    getResourceKindLabel,
} from '../../../entities/resource/model/aggregateResources';
import styles from './ResourceForecast.module.css';

type ResourceForecastProps = {
    asteroids: Asteroid[];
    title?: string;
};

export function ResourceForecast({ asteroids, title = 'Прогноз добычи' }: ResourceForecastProps) {
    const resources = aggregateResources(asteroids);

    return (
        <Card className={styles.card} type="container" view="outlined">
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.caption}>Сумма ресурсов по всем астероидам миссии</p>
                </div>
                <span className={styles.count}>{resources.length}</span>
            </div>
            <div className={styles.list}>
                {resources.map((resource) => (
                    <div className={styles.item} key={`${resource.kind}:${resource.slug}`}>
                        <span className={styles.symbol} data-kind={resource.kind}>
                            {resource.symbol}
                        </span>
                        <span className={styles.name}>
                            {resource.name}
                            <small>{getResourceKindLabel(resource.kind)}</small>
                        </span>
                        <strong className={styles.amount}>{formatResourceAmount(resource)}</strong>
                    </div>
                ))}
            </div>
        </Card>
    );
}
