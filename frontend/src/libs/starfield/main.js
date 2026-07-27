/*
    Этап 1. Выбраться из callback hell и ускорить загрузку до ~200-300мс.
    Этап 2. Синхронизировать отрисовку с частотой монитора.
    Этап 3. Вынести вычисления computeStars и computePlanets в отдельный поток.
    Этап 4. Синхронизировать отрисовку между вкладками через общее состояние.
*/

import { STAR_COUNT } from './engine/constants.js';
import { fetchChar, fetchSize } from './engine/loaders.js';
import {
    createFpsMeter,
    createLoadTimer,
    createSceneClock,
    getRenderer,
    setFpsText,
    setSeedText,
} from './engine/ui.js';

const loadTimer = createLoadTimer();
loadTimer.start();

if (new URLSearchParams(window.location.search).get('hideStats') === 'true') {
    document.getElementById('stats').hidden = true;
}

let sharedWorker;

function fetchSizeAsync(url) {
    return new Promise((resolve, reject) => {
        fetchSize(url, (error, size) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(size);
        });
    });
}

function fetchCharAsync(url, index) {
    return new Promise((resolve, reject) => {
        fetchChar(url, index, (error, char) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(char);
        });
    });
}

function fetchCharWithRetry(url, index) {
    return fetchCharAsync(url, index).catch(() => fetchCharWithRetry(url, index));
}

async function loadFile(url) {
    const size = await fetchSizeAsync(url);
    const chars = await Promise.all(
        Array.from({ length: size }, (_, index) => fetchCharWithRetry(url, index))
    );

    return JSON.parse(chars.join(''));
}

function getSharedSceneState() {
    sharedWorker = new SharedWorker(new URL('./shared.js', import.meta.url), {
        name: 'starfield-state',
    });

    return new Promise((resolve) => {
        sharedWorker.port.onmessage = ({ data }) => resolve(data);
        sharedWorker.port.start();
    });
}

function start({ seed, sceneStartEpoch }) {
    loadTimer.finish();
    setSeedText(seed);

    const renderer = getRenderer();
    const sceneTime = createSceneClock(sceneStartEpoch);
    const fpsMeter = createFpsMeter();
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module',
    });

    let starsBuffer = new Float32Array(STAR_COUNT * 3).buffer;
    let readyFrame = null;
    let workerIsBusy = false;

    worker.onmessage = ({ data }) => {
        readyFrame = data;
        workerIsBusy = false;
    };

    worker.onerror = (error) => {
        console.error('[worker]', error.message);
    };

    function frame(now) {
        const { width, height } = renderer.size();

        if (readyFrame) {
            renderer.draw(new Float32Array(readyFrame.starsBuffer), readyFrame.planets);

            const fps = fpsMeter.tick(now);
            if (fps) {
                setFpsText(fps);
            }

            starsBuffer = readyFrame.starsBuffer;
            readyFrame = null;
        }

        if (!workerIsBusy && starsBuffer) {
            const buffer = starsBuffer;
            starsBuffer = null;
            workerIsBusy = true;

            worker.postMessage(
                {
                    seed,
                    sceneTimeMs: sceneTime(),
                    width,
                    height,
                    starsBuffer: buffer,
                },
                [buffer]
            );
        }

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

async function bootstrap() {
    const [calibration, palette] = await Promise.all([
        loadFile('./engine/config/ship-calibration.json'),
        loadFile('./engine/config/nebula-palette.json'),
    ]);
    const sceneState = await getSharedSceneState();

    console.log('[loaded] focal:', calibration.focal, '| palette entries:', palette.palette.length);
    start(sceneState);
}

bootstrap().catch((error) => {
    console.error(error);
});
