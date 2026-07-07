import { STAR_COUNT } from './constants.js';

const MS_PER_SECOND = 1000;
const FPS_FRACTION_DIGITS = 1;
const DEFAULT_FPS_INTERVAL_MS = 500;

function createRenderer(canvas) {
    const context = canvas.getContext('2d', { alpha: false });
    let canvasWidth = 0;
    let canvasHeight = 0;

    function resize() {
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvasWidth = Math.floor(window.innerWidth);
        canvasHeight = Math.floor(window.innerHeight);
        canvas.width = Math.floor(canvasWidth * devicePixelRatio);
        canvas.height = Math.floor(canvasHeight * devicePixelRatio);
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(stars, planets) {
        context.fillStyle = 'rgba(0, 0, 0, 0.35)';
        context.fillRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < STAR_COUNT; i++) {
            const offset = i * 3;
            const screenX = stars[offset];
            const screenY = stars[offset + 1];
            const brightness = stars[offset + 2];
            if (brightness <= 0.02) continue;
            if (
                screenX < -2 ||
                screenX > canvasWidth + 2 ||
                screenY < -2 ||
                screenY > canvasHeight + 2
            )
                continue;

            const gray = Math.floor(brightness * 255);
            context.fillStyle = `rgb(${gray},${gray},${Math.min(255, gray + 20)})`;
            const size = brightness > 0.6 ? 2 : 1;
            context.fillRect(screenX - size * 0.5, screenY - size * 0.5, size, size);
        }

        for (const planet of planets) {
            const [red, green, blue] = planet.color;
            const { x, y, tailX, tailY, size, alpha, sizeMult, spawnScale } = planet;
            const drawSize = size * sizeMult * spawnScale;

            const tailDx = tailX - x;
            const tailDy = tailY - y;
            const tailLen = Math.sqrt(tailDx * tailDx + tailDy * tailDy);

            if (tailLen > 0.5) {
                const tailGrad = context.createLinearGradient(x, y, tailX, tailY);
                tailGrad.addColorStop(
                    0,
                    `rgba(${red},${green},${blue},${(alpha * 0.85).toFixed(3)})`
                );
                tailGrad.addColorStop(
                    0.4,
                    `rgba(${red},${green},${blue},${(alpha * 0.3).toFixed(3)})`
                );
                tailGrad.addColorStop(1, 'rgba(0,0,0,0)');

                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(tailX, tailY);
                context.lineWidth = drawSize * 2;
                context.lineCap = 'round';
                context.strokeStyle = tailGrad;
                context.stroke();
            }

            const headGrad = context.createRadialGradient(x, y, 0, x, y, drawSize);
            const brightR = Math.min(255, Math.round(red + (255 - red) * 0.55));
            const brightG = Math.min(255, Math.round(green + (255 - green) * 0.55));
            const brightB = Math.min(255, Math.round(blue + (255 - blue) * 0.55));
            headGrad.addColorStop(0, `rgba(${brightR},${brightG},${brightB},${alpha.toFixed(3)})`);
            headGrad.addColorStop(0.5, `rgba(${red},${green},${blue},${alpha.toFixed(3)})`);
            headGrad.addColorStop(1, `rgba(${red},${green},${blue},${(alpha * 0.6).toFixed(3)})`);

            context.beginPath();
            context.arc(x, y, drawSize, 0, Math.PI * 2);
            context.fillStyle = headGrad;
            context.fill();
        }
    }

    function size() {
        return { width: canvasWidth, height: canvasHeight };
    }

    return { draw, size };
}

export function getRenderer() {
    return createRenderer(document.getElementById('canvas'));
}

function getStatsElements() {
    return {
        fps: document.getElementById('fps'),
        loaded: document.getElementById('loaded'),
        seed: document.getElementById('seed'),
    };
}

function setElementText(element, value) {
    element.textContent = String(value);
}

export function setSeedText(seed) {
    setElementText(getStatsElements().seed, seed);
}

function setLoadedText(loadedMs) {
    setElementText(getStatsElements().loaded, Math.round(loadedMs));
}

export function setFpsText(fps) {
    setElementText(getStatsElements().fps, fps);
}

export function createLoadTimer() {
    let startedAt = performance.now();

    return {
        start() {
            startedAt = performance.now();
            return startedAt;
        },

        finish() {
            const elapsedMs = performance.now() - startedAt;
            setLoadedText(elapsedMs);
            return elapsedMs;
        },
    };
}

export function createFpsMeter({ intervalMs = DEFAULT_FPS_INTERVAL_MS } = {}) {
    let framesInWindow = 0;
    let windowStartedAt = performance.now();

    const resetWindow = (now) => {
        framesInWindow = 0;
        windowStartedAt = now;
    };

    return {
        tick(now) {
            framesInWindow++;

            const elapsedMs = now - windowStartedAt;
            if (elapsedMs <= intervalMs) {
                return null;
            }

            const fps = ((framesInWindow * MS_PER_SECOND) / elapsedMs).toFixed(FPS_FRACTION_DIGITS);
            resetWindow(now);
            return fps;
        },

        reset(now = performance.now()) {
            resetWindow(now);
        },
    };
}

export function generateSeed() {
    return 1_000_000 + Math.floor(Math.random() * 9_000_000);
}

export function createSceneClock(sceneStartEpoch = Date.now()) {
    return function sceneTime() {
        return Date.now() - sceneStartEpoch;
    };
}

(function initStatsVisibility() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('hideStats') === 'true') {
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            statsElement.style.display = 'none';
        }
    }
})();
