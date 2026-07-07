import { SAMPLE_ASTEROIDS } from './sampleAsteroids';

const REQUEST_DELAY_MS = 500;
const FAILURE_RATE = 0;

const wait = (delayMs: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs);
    });

interface MineAsteroidParams {
    asteroids: string[];
}

export async function mineAsteroid({ asteroids }: MineAsteroidParams): Promise<void> {
    // На момент выполнения домашки по типизации у вас ещё не будет рабочего
    // сервера. Пока оставьте такую заглушку, но подумайте о будущем: как вы
    // будете обрабатывать ошибки и как сделать это явно на уровне типизации

    await wait(REQUEST_DELAY_MS);

    // Для тестирования обработки ошибки поднимите FAILURE_RATE
    if (Math.random() < FAILURE_RATE) {
        throw new Error('500 - Вымышленный бекенд временно недоступен');
    }

    const existingAsteroidIds = new Set(SAMPLE_ASTEROIDS.map((asteroid) => asteroid.id));
    const hasMissingAsteroid = asteroids.some((asteroid) => !existingAsteroidIds.has(asteroid));

    if (hasMissingAsteroid) {
        throw new Error('404 - Вымышленный бекенд не нашёл астероид для добычи');
    }
}
