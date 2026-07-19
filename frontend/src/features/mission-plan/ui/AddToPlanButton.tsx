import { Check, Plus } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';

import type { Asteroid } from '../../../entities/asteroid/model/types';
import { useMissionPlanStore } from '../model/missionPlanStore';

type AddToPlanButtonProps = {
    asteroid: Asteroid;
};

const STATUS_LABELS = {
    active: 'Уже добывается',
    done: 'Уже добыт',
} as const;

export function AddToPlanButton({ asteroid }: AddToPlanButtonProps) {
    const addAsteroid = useMissionPlanStore((state) => state.addAsteroid);
    const isInPlan = useMissionPlanStore((state) =>
        state.asteroids.some((item) => item.id === asteroid.id)
    );

    if (asteroid.status !== 'available') {
        return (
            <Button width="max" disabled>
                {STATUS_LABELS[asteroid.status]}
            </Button>
        );
    }

    return (
        <Button
            view={isInPlan ? 'outlined-success' : 'action'}
            width="max"
            disabled={isInPlan}
            onClick={() => addAsteroid(asteroid)}
        >
            <Icon data={isInPlan ? Check : Plus} size={16} />
            {isInPlan ? 'В плане' : 'В план миссии'}
        </Button>
    );
}
