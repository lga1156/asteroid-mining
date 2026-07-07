import type { Asteroid } from '../types/asteroid';
import { SAMPLE_ASTEROIDS } from './sampleAsteroids';

const REQUEST_DELAY_MS = 500;
const FAILURE_RATE = 0;

const wait = (delayMs: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs);
    });

export async function fetchAsteroids(): Promise<Asteroid[]> {
    // На момент выполнения домашки по типизации у вас ещё не будет рабочего
    // сервера. Пока оставьте такую заглушку, но подумайте о будущем: как вы
    // будете обрабатывать ошибки и как сделать это явно на уровне типизации

    await wait(REQUEST_DELAY_MS);

    // Для тестирования обработки ошибки поднимите FAILURE_RATE
    if (Math.random() < FAILURE_RATE) {
        throw new Error('500 - Вымышленный бекенд временно недоступен');
    }

    return SAMPLE_ASTEROIDS.map((asteroid) => ({
        ...asteroid,
        resources: asteroid.resources.map((resource) => ({ ...resource })),
    }));
}
