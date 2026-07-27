import { ArrowRotateLeft, Magnifier } from '@gravity-ui/icons';
import { Alert, Button, Icon, Loader } from '@gravity-ui/uikit';
import { useQuery } from '@tanstack/react-query';

import { fetchAsteroids } from '../../../entities/asteroid/api/asteroidsApi';
import { EmptyState } from '../../../shared/ui/EmptyState/EmptyState';
import { PageTitle } from '../../../shared/ui/PageTitle/PageTitle';
import { AsteroidList } from '../../../widgets/asteroid-list/ui/AsteroidList';
import { Hero } from '../../../widgets/hero/ui/Hero';
import styles from './AsteroidsPage.module.css';

export default function AsteroidsPage() {
    const asteroidQuery = useQuery({
        queryKey: ['asteroids', { page: 10, perPage: 12 }],
        queryFn: () => fetchAsteroids(10, 12),
        staleTime: 30_000,
    });

    return (
        <>
            <Hero />
            <div className={styles.page}>
                <PageTitle description="Доступные цели и прогноз ресурсов. Нажмите на карточку, чтобы изучить состав астероида.">
                    Астероиды
                </PageTitle>

                {asteroidQuery.isPending ? (
                    <div className={styles.loading}>
                        <Loader size="l" />
                        <span>Ищем доступные астероиды…</span>
                    </div>
                ) : asteroidQuery.isError ? (
                    <div className={styles.error}>
                        <Alert
                            theme="danger"
                            title="Не удалось загрузить астероиды"
                            message={asteroidQuery.error.message}
                        />
                        <Button onClick={() => asteroidQuery.refetch()}>
                            <Icon data={ArrowRotateLeft} />
                            Повторить
                        </Button>
                    </div>
                ) : asteroidQuery.data.asteroids.length === 0 ? (
                    <EmptyState
                        title="Доступных астероидов пока нет"
                        description="Флот уже обрабатывает ближайшие цели. Обновите список немного позже."
                        icon={<Icon data={Magnifier} size={28} />}
                        action={
                            <Button onClick={() => asteroidQuery.refetch()}>Обновить список</Button>
                        }
                    />
                ) : (
                    <AsteroidList asteroids={asteroidQuery.data.asteroids} />
                )}
            </div>
        </>
    );
}
