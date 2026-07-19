import { CircleExclamation, Rocket } from '@gravity-ui/icons';
import { Alert, Button, Card, Icon, Label, SegmentedRadioGroup } from '@gravity-ui/uikit';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Mission } from '../../../entities/mission/model/types';
import { MissionDetailsDialog } from '../../../features/mission-details/ui/MissionDetailsDialog';
import { useMiningStatusStore } from '../../../features/mining-status/model/miningStatusStore';
import { EmptyState } from '../../../shared/ui/EmptyState/EmptyState';
import { PageTitle } from '../../../shared/ui/PageTitle/PageTitle';
import styles from './MiningStatusPage.module.css';

type MissionFilter = 'active' | 'all' | 'done';

const STATUS_PROPS = {
    active: { label: 'Активна', theme: 'warning' },
    done: { label: 'Выполнена', theme: 'success' },
} as const;

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function MiningStatusPage() {
    const missions = useMiningStatusStore((state) => state.missions);
    const connectionStatus = useMiningStatusStore((state) => state.connectionStatus);
    const [filter, setFilter] = useState<MissionFilter>('all');
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
    const navigate = useNavigate();
    const visibleMissions = useMemo(
        () =>
            [...missions]
                .filter((mission) => filter === 'all' || mission.status === filter)
                .sort((left, right) => right.ttl - left.ttl),
        [filter, missions]
    );
    const selectedMission = missions.find((mission) => mission.id === selectedMissionId) ?? null;

    return (
        <main className={styles.page}>
            <PageTitle
                description="Следите за активными экспедициями и изучайте результаты завершённых миссий."
                actions={
                    <SegmentedRadioGroup<MissionFilter>
                        value={filter}
                        onUpdate={setFilter}
                        aria-label="Фильтр миссий"
                    >
                        <SegmentedRadioGroup.Option value="all">Все</SegmentedRadioGroup.Option>
                        <SegmentedRadioGroup.Option value="active">
                            Активные
                        </SegmentedRadioGroup.Option>
                        <SegmentedRadioGroup.Option value="done">
                            Завершённые
                        </SegmentedRadioGroup.Option>
                    </SegmentedRadioGroup>
                }
            >
                Статус добычи
            </PageTitle>

            {connectionStatus !== 'connected' ? (
                <Alert
                    className={styles.connection}
                    theme={connectionStatus === 'connecting' ? 'info' : 'warning'}
                    title={
                        connectionStatus === 'connecting'
                            ? 'Подключаем телеметрию'
                            : 'Телеметрия недоступна'
                    }
                    message={
                        connectionStatus === 'connecting'
                            ? 'Список обновится после подключения к центру управления.'
                            : 'Показываем последний сохранённый статус и пробуем переподключиться.'
                    }
                />
            ) : null}

            {visibleMissions.length === 0 ? (
                <EmptyState
                    title={
                        missions.length === 0 ? 'Миссий пока нет' : 'Нет миссий с таким статусом'
                    }
                    description={
                        missions.length === 0
                            ? 'Соберите план и отправьте первую экспедицию на добычу.'
                            : 'Переключите фильтр, чтобы увидеть остальные экспедиции.'
                    }
                    icon={
                        <Icon data={missions.length === 0 ? Rocket : CircleExclamation} size={28} />
                    }
                    action={
                        missions.length === 0 ? (
                            <Button view="action" onClick={() => navigate('/mission-plan')}>
                                Открыть план миссии
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <section className={styles.grid} aria-label="Список миссий">
                    {visibleMissions.map((mission) => (
                        <MissionCard
                            key={mission.id}
                            mission={mission}
                            onClick={() => setSelectedMissionId(mission.id)}
                        />
                    ))}
                </section>
            )}

            <MissionDetailsDialog
                mission={selectedMission}
                onClose={() => setSelectedMissionId(null)}
            />
        </main>
    );
}

function MissionCard({ mission, onClick }: { mission: Mission; onClick: () => void }) {
    const status = STATUS_PROPS[mission.status];

    return (
        <Card className={styles.card} type="container" view="outlined">
            <button className={styles.cardButton} type="button" onClick={onClick}>
                <div className={styles.cardHeader}>
                    <span className={styles.missionIcon}>
                        <Icon data={Rocket} size={20} />
                    </span>
                    <Label theme={status.theme}>{status.label}</Label>
                </div>
                <h2>Миссия {mission.id.slice(0, 8)}</h2>
                <p className={styles.date}>
                    {mission.status === 'done' ? 'Завершена' : 'Расчётное завершение'}:{' '}
                    {dateFormatter.format(new Date(mission.ttl))}
                </p>
                <div className={styles.cardFooter}>
                    <span>
                        <strong>{mission.asteroids.length}</strong> астероидов
                    </span>
                    <span>Подробнее →</span>
                </div>
            </button>
        </Card>
    );
}
