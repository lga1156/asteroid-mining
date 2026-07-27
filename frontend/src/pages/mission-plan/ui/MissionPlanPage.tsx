import { Rocket, TrashBin } from '@gravity-ui/icons';
import { Button, Card, Dialog, Icon } from '@gravity-ui/uikit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import asteroidPlaceholder from '../../../assets/asteroid-placeholder.svg';
import type { Asteroid } from '../../../entities/asteroid/model/types';
import { createMission } from '../../../entities/mission/api/createMission';
import { useMiningStatusStore } from '../../../features/mining-status/model/miningStatusStore';
import { useMissionPlanStore } from '../../../features/mission-plan/model/missionPlanStore';
import { ApiError } from '../../../shared/api/http';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog/ConfirmDialog';
import { EmptyState } from '../../../shared/ui/EmptyState/EmptyState';
import { PageTitle } from '../../../shared/ui/PageTitle/PageTitle';
import { ResourceForecast } from '../../../widgets/resource-forecast/ui/ResourceForecast';
import styles from './MissionPlanPage.module.css';

type LaunchFeedback =
    | { message: string; missionId: string; type: 'success' }
    | { message: string; type: 'error' };

export default function MissionPlanPage() {
    const asteroids = useMissionPlanStore((state) => state.asteroids);
    const clearPlan = useMissionPlanStore((state) => state.clear);
    const removeAsteroid = useMissionPlanStore((state) => state.removeAsteroid);
    const removeAsteroids = useMissionPlanStore((state) => state.removeAsteroids);
    const addMission = useMiningStatusStore((state) => state.addMission);
    const [asteroidToRemove, setAsteroidToRemove] = useState<Asteroid | null>(null);
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const [feedback, setFeedback] = useState<LaunchFeedback | null>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const launchMutation = useMutation({
        mutationFn: (submittedAsteroids: Asteroid[]) =>
            createMission(submittedAsteroids.map((asteroid) => asteroid.id)),
        onSuccess: (mission, submittedAsteroids) => {
            addMission(mission, submittedAsteroids);
            removeAsteroids(submittedAsteroids.map((asteroid) => asteroid.id));
            setFeedback({
                type: 'success',
                missionId: mission.id,
                message: `Миссия ${mission.id.slice(0, 8)} принята центром управления.`,
            });
            void queryClient.invalidateQueries({ queryKey: ['asteroids'] });
        },
        onError: (error) => {
            setFeedback({
                type: 'error',
                message:
                    error instanceof ApiError
                        ? error.message
                        : 'Не удалось отправить план. Проверьте соединение и повторите попытку.',
            });
        },
    });

    if (asteroids.length === 0) {
        return (
            <main className={styles.page}>
                <PageTitle description="Добавляйте доступные астероиды с главной страницы и запускайте их одной миссией.">
                    План миссии
                </PageTitle>
                <EmptyState
                    title="План миссии пуст"
                    description="Выберите астероиды, чтобы увидеть общий прогноз добычи и отправить флот."
                    icon={<Icon data={Rocket} size={28} />}
                    action={
                        <Button view="action" onClick={() => navigate('/')}>
                            Выбрать астероиды
                        </Button>
                    }
                />
                <LaunchFeedbackDialog
                    feedback={feedback}
                    onClose={() => setFeedback(null)}
                    onShowStatus={() => navigate('/mining-status')}
                />
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <PageTitle
                description={`${asteroids.length} ${getAsteroidWord(asteroids.length)} готово к отправке`}
                actions={
                    <Button view="flat-danger" onClick={() => setIsClearDialogOpen(true)}>
                        <Icon data={TrashBin} />
                        Очистить
                    </Button>
                }
            >
                План миссии
            </PageTitle>

            <div className={styles.layout}>
                <section className={styles.asteroids} aria-label="Астероиды в плане">
                    {asteroids.map((asteroid) => (
                        <Card
                            className={styles.asteroid}
                            key={asteroid.id}
                            type="container"
                            view="outlined"
                        >
                            <img className={styles.image} src={asteroidPlaceholder} alt="" />
                            <div className={styles.asteroidInfo}>
                                <h2>{asteroid.name}</h2>
                                <p>
                                    {asteroid.resources.length}{' '}
                                    {getResourceWord(asteroid.resources.length)} ·{' '}
                                    {Number(asteroid.distanceKm).toLocaleString('ru-RU')} км
                                </p>
                            </div>
                            <Button
                                view="flat-danger"
                                aria-label={`Удалить ${asteroid.name} из плана`}
                                onClick={() => setAsteroidToRemove(asteroid)}
                            >
                                <Icon data={TrashBin} />
                                Удалить
                            </Button>
                        </Card>
                    ))}
                </section>

                <aside className={styles.summary}>
                    <ResourceForecast asteroids={asteroids} />
                    <Button
                        view="action"
                        size="l"
                        width="max"
                        loading={launchMutation.isPending}
                        onClick={() => launchMutation.mutate(asteroids)}
                    >
                        <Icon data={Rocket} />
                        Отправить на добычу
                    </Button>
                    <p className={styles.notice}>После запуска состав миссии изменить нельзя.</p>
                </aside>
            </div>

            <ConfirmDialog
                open={Boolean(asteroidToRemove)}
                title="Удалить астероид из плана?"
                description={
                    asteroidToRemove
                        ? `${asteroidToRemove.name} и его ресурсы перестанут учитываться в прогнозе.`
                        : ''
                }
                onClose={() => setAsteroidToRemove(null)}
                onConfirm={() => {
                    if (asteroidToRemove) {
                        removeAsteroid(asteroidToRemove.id);
                    }
                }}
            />
            <ConfirmDialog
                open={isClearDialogOpen}
                title="Очистить план миссии?"
                description="Все выбранные астероиды будут удалены из плана. Это действие нельзя отменить."
                confirmText="Очистить"
                onClose={() => setIsClearDialogOpen(false)}
                onConfirm={clearPlan}
            />
            <LaunchFeedbackDialog
                feedback={feedback}
                onClose={() => setFeedback(null)}
                onShowStatus={() => navigate('/mining-status')}
            />
        </main>
    );
}

function LaunchFeedbackDialog({
    feedback,
    onClose,
    onShowStatus,
}: {
    feedback: LaunchFeedback | null;
    onClose: () => void;
    onShowStatus: () => void;
}) {
    return (
        <Dialog open={Boolean(feedback)} onClose={onClose} size="s" hasCloseButton>
            <Dialog.Header
                caption={feedback?.type === 'success' ? 'Миссия запущена' : 'Ошибка запуска'}
            />
            <Dialog.Body>
                <p className={styles.feedback}>{feedback?.message}</p>
            </Dialog.Body>
            <Dialog.Footer
                textButtonCancel="Закрыть"
                textButtonApply={feedback?.type === 'success' ? 'К статусу добычи' : 'Понятно'}
                onClickButtonCancel={onClose}
                onClickButtonApply={() => {
                    onClose();
                    if (feedback?.type === 'success') {
                        onShowStatus();
                    }
                }}
            />
        </Dialog>
    );
}

function getAsteroidWord(count: number) {
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'астероидов';
    }

    if (count % 10 === 1) {
        return 'астероид';
    }

    if (count % 10 >= 2 && count % 10 <= 4) {
        return 'астероида';
    }

    return 'астероидов';
}

function getResourceWord(count: number) {
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'ресурсов';
    }

    if (count % 10 === 1) {
        return 'ресурс';
    }

    if (count % 10 >= 2 && count % 10 <= 4) {
        return 'ресурса';
    }

    return 'ресурсов';
}
