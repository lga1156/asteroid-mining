import { computePlanets, computeStars } from './engine/scene.js';

self.onmessage = ({ data }) => {
    const { seed, sceneTimeMs, width, height, starsBuffer } = data;
    const stars = new Float32Array(starsBuffer);

    computeStars(seed, sceneTimeMs, width, height, stars);
    const planets = computePlanets(seed, sceneTimeMs, width, height);

    self.postMessage(
        {
            starsBuffer: stars.buffer,
            planets,
        },
        [stars.buffer]
    );
};
