import type { Asteroid, AsteroidResource } from '../../asteroid/model/types';

export type AggregatedResource = {
    amount: number;
    kind: AsteroidResource['kind'];
    name: string;
    slug: string;
    symbol: string;
    unit: 'т' | 'л' | 'м³';
};

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

export function getResourceAmount(resource: AsteroidResource) {
    switch (resource.kind) {
        case 'mineral':
            return { amount: Number(resource.mass), unit: 'т' as const };
        case 'liquid':
            return { amount: Number(resource.volume), unit: 'л' as const };
        case 'gas':
            return { amount: Number(resource.volume), unit: 'м³' as const };
    }
}

export function aggregateResources(asteroids: Asteroid[]) {
    const resources = new Map<string, AggregatedResource>();

    for (const asteroid of asteroids) {
        for (const resource of asteroid.resources) {
            const key = `${resource.kind}:${resource.slug}`;
            const { amount, unit } = getResourceAmount(resource);
            const aggregatedResource = resources.get(key);

            if (aggregatedResource) {
                aggregatedResource.amount += amount;
            } else {
                resources.set(key, {
                    amount,
                    kind: resource.kind,
                    name: resource.name,
                    slug: resource.slug,
                    symbol: resource.symbol,
                    unit,
                });
            }
        }
    }

    return [...resources.values()].sort((left, right) => right.amount - left.amount);
}

export function formatResourceAmount(resource: Pick<AggregatedResource, 'amount' | 'unit'>) {
    return `${numberFormatter.format(resource.amount)} ${resource.unit}`;
}

export function getResourceKindLabel(kind: AsteroidResource['kind']) {
    const labels = {
        gas: 'Газ',
        liquid: 'Жидкость',
        mineral: 'Минерал',
    } satisfies Record<AsteroidResource['kind'], string>;

    return labels[kind];
}
