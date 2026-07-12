import type { ApiResult, AsteroidResponse } from '../types/domain';
import { SAMPLE_ASTEROIDS } from './sampleAsteroids';

const REQUEST_DELAY_MS = 500;
const FAILURE_RATE = 0;

const wait = (delayMs: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs);
    });

export async function fetchAsteroids(): Promise<ApiResult<AsteroidResponse[]>> {
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

    return {
        ok: true,
        data: SAMPLE_ASTEROIDS.map((asteroid) => ({
            ...asteroid,
            resources: asteroid.resources.map((resource) => ({ ...resource })),
        })),
    };
}
