import { ArrowRotateLeft } from '@gravity-ui/icons';
import { Alert, Button, Dialog, Icon, Label, Loader } from '@gravity-ui/uikit';
import { useQuery } from '@tanstack/react-query';

import { fetchAsteroid } from '../../../entities/asteroid/api/asteroidsApi';
import type { Asteroid } from '../../../entities/asteroid/model/types';
import type { Mission } from '../../../entities/mission/model/types';
import {
    aggregateResources,
    formatResourceAmount,
} from '../../../entities/resource/model/aggregateResources';
import styles from './MissionDetailsDialog.module.css';

type MissionDetailsDialogProps = {
    mission: Mission | null;
    onClose: () => void;
};

const STATUS_LABELS = {
    active: { label: 'Активна', theme: 'warning' },
    done: { label: 'Выполнена', theme: 'success' },
} as const;

const CHART_COLORS = ['#4269d0', '#efb118', '#6cc5d3', '#ff725c', '#87bb62', '#a463f2'];

async function fetchMissionAsteroids(mission: Mission) {
    if (
        mission.asteroidSnapshots?.length === mission.asteroids.length &&
        mission.asteroids.every((asteroidId) =>
            mission.asteroidSnapshots?.some((asteroid) => asteroid.id === asteroidId)
        )
    ) {
        return mission.asteroidSnapshots;
    }

    return Promise.all(mission.asteroids.map(fetchAsteroid));
}

export function MissionDetailsDialog({ mission, onClose }: MissionDetailsDialogProps) {
    return (
        <Dialog open={Boolean(mission)} onClose={onClose} size="l" hasCloseButton>
            {mission ? <MissionDetails mission={mission} /> : null}
        </Dialog>
    );
}

function MissionDetails({ mission }: { mission: Mission }) {
    const asteroidQuery = useQuery({
        queryKey: ['mission-asteroids', mission.id, mission.asteroids],
        queryFn: () => fetchMissionAsteroids(mission),
        staleTime: Number.POSITIVE_INFINITY,
    });
    const status = STATUS_LABELS[mission.status];

    return (
        <>
            <Dialog.Header
                caption={`Миссия ${mission.id.slice(0, 8)}`}
                insertAfter={<Label theme={status.theme}>{status.label}</Label>}
            />
            <Dialog.Body className={styles.body}>
                {asteroidQuery.isPending ? (
                    <div className={styles.loading}>
                        <Loader />
                        Загружаем состав миссии…
                    </div>
                ) : asteroidQuery.isError ? (
                    <div className={styles.error}>
                        <Alert
                            theme="danger"
                            title="Не удалось загрузить состав миссии"
                            message={asteroidQuery.error.message}
                        />
                        <Button onClick={() => asteroidQuery.refetch()}>
                            <Icon data={ArrowRotateLeft} />
                            Повторить
                        </Button>
                    </div>
                ) : (
                    <MissionContent mission={mission} asteroids={asteroidQuery.data} />
                )}
            </Dialog.Body>
        </>
    );
}

function MissionContent({ mission, asteroids }: { mission: Mission; asteroids: Asteroid[] }) {
    const resources = aggregateResources(asteroids);

    return (
        <div className={styles.content}>
            <section>
                <h3 className={styles.title}>Астероиды миссии</h3>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Астероид</th>
                                <th>Диаметр</th>
                                <th>Расстояние</th>
                                <th>Ресурсов</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asteroids.map((asteroid) => (
                                <tr key={asteroid.id}>
                                    <td>{asteroid.name}</td>
                                    <td>
                                        {Number(asteroid.diameterMeters).toLocaleString('ru-RU')} м
                                    </td>
                                    <td>
                                        {Number(asteroid.distanceKm).toLocaleString('ru-RU')} км
                                    </td>
                                    <td>{asteroid.resources.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {mission.status === 'done' ? (
                <section>
                    <h3 className={styles.title}>Добытые ресурсы</h3>
                    <div className={styles.resourcesBlock}>
                        <DonutChart resources={resources} />
                        <div className={styles.resources}>
                            {resources.map((resource, index) => (
                                <div
                                    className={styles.resource}
                                    key={`${resource.kind}:${resource.slug}`}
                                >
                                    <span
                                        className={styles.legend}
                                        style={{
                                            backgroundColor:
                                                CHART_COLORS[index % CHART_COLORS.length],
                                        }}
                                    />
                                    <span className={styles.resourceName}>{resource.name}</span>
                                    <strong>{formatResourceAmount(resource)}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <Alert
                    theme="info"
                    title="Добыча продолжается"
                    message="Итоговый объём ресурсов появится после завершения миссии."
                />
            )}
        </div>
    );
}

function DonutChart({ resources }: { resources: ReturnType<typeof aggregateResources> }) {
    const total = resources.reduce((sum, resource) => sum + resource.amount, 0);
    let cursor = 0;
    const segments = resources.map((resource, index) => {
        const start = cursor;
        cursor += total === 0 ? 0 : (resource.amount / total) * 100;
        return `${CHART_COLORS[index % CHART_COLORS.length]} ${start}% ${cursor}%`;
    });
    const background =
        segments.length > 0
            ? `conic-gradient(${segments.join(', ')})`
            : 'var(--g-color-base-generic)';

    return (
        <div
            className={styles.chart}
            style={{ background }}
            role="img"
            aria-label={`Распределение ${resources.length} видов добытых ресурсов`}
        >
            <div className={styles.chartCenter}>
                <strong>{resources.length}</strong>
                <span>ресурсов</span>
            </div>
        </div>
    );
}
