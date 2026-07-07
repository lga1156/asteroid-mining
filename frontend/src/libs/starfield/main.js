/*
    Этап 1. Выбраться из callback hell и ускорить загрузку до ~200-300мс.
    Этап 2. Синхронизировать отрисовку с частотой монитора.
    Этап 3. Вынести вычисления computeStars и computePlanets в отдельный поток.
    Этап 4. Синхронизировать отрисовку между вкладками через общее состояние.
*/

import { STAR_COUNT } from './engine/constants.js';
import { fetchChar, fetchSize } from './engine/loaders.js';
import { computePlanets, computeStars } from './engine/scene.js';
import {
    createFpsMeter,
    createLoadTimer,
    createSceneClock,
    generateSeed,
    getRenderer,
    setFpsText,
    setSeedText,
} from './engine/ui.js';

const loadTimer = createLoadTimer();
loadTimer.start();

function loadFile(url, callback) {
    fetchSize(url, (sizeError, size) => {
        if (sizeError) {
            callback(sizeError);
            return;
        }

        const chars = [];

        function readChar(index) {
            if (index === size) {
                try {
                    callback(null, JSON.parse(chars.join('')));
                } catch (parseError) {
                    callback(parseError);
                }
                return;
            }

            fetchChar(url, index, (charError, char) => {
                if (charError) {
                    readChar(index);
                    return;
                }
                chars[index] = char;
                readChar(index + 1);
            });
        }

        readChar(0);
    });
}

loadFile('./engine/config/ship-calibration.json', (calibrationError, calibration) => {
    if (calibrationError) {
        console.error(calibrationError);
        return;
    }

    loadFile('./engine/config/nebula-palette.json', (paletteError, palette) => {
        if (paletteError) {
            console.error(paletteError);
            return;
        }

        console.log(
            '[loaded] focal:',
            calibration.focal,
            '| palette entries:',
            palette.palette.length
        );
        start();
    });
});

function start() {
    loadTimer.finish();

    const seed = generateSeed();
    setSeedText(seed);

    const renderer = getRenderer();
    const stars = new Float32Array(STAR_COUNT * 3);
    const sceneTime = createSceneClock();
    const fpsMeter = createFpsMeter();

    function frame() {
        const now = performance.now();
        const tScene = sceneTime();
        const { width, height } = renderer.size();

        renderer.draw(
            computeStars(seed, tScene, width, height, stars),
            computePlanets(seed, tScene, width, height)
        );

        const fps = fpsMeter.tick(now);
        if (fps) {
            setFpsText(fps);
        }
    }

    setInterval(frame, 16);
}
