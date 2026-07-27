import { SAMPLE_ASTEROIDS } from './sampleAsteroids';
import {
    createMiningId,
    type ApiResult,
    type MiningRequest,
    type MiningResponse,
} from '../types/domain';

const REQUEST_DELAY_MS = 500;
const FAILURE_RATE = 0;

const wait = (delayMs: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs);
    });

export async function mineAsteroid({
    asteroids,
}: MiningRequest): Promise<ApiResult<MiningResponse>> {
    // На момент выполнения домашки по типизации у вас ещё не будет рабочего
    // сервера. Пока оставьте такую заглушку, но подумайте о будущем: как вы
    // будете обрабатывать ошибки и как сделать это явно на уровне типизации

    await wait(REQUEST_DELAY_MS);

    // Для тестирования обработки ошибки поднимите FAILURE_RATE
    if (Math.random() < FAILURE_RATE) {
        return {
            ok: false,
            error: { code: 500, error: 'Вымышленный бекенд временно недоступен' },
        };
    }

    const existingAsteroidIds = new Set(SAMPLE_ASTEROIDS.map((asteroid) => asteroid.id));
    const hasMissingAsteroid = asteroids.some((asteroid) => !existingAsteroidIds.has(asteroid));

    if (hasMissingAsteroid) {
        return {
            ok: false,
            error: { code: 404, error: 'Вымышленный бекенд не нашёл астероид для добычи' },
        };
    }

    return {
        ok: true,
        data: { id: createMiningId(`mining-${Date.now()}`), asteroids },
    };
}
