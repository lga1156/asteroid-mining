const sceneState = {
    seed: 1_000_000 + Math.floor(Math.random() * 9_000_000),
    sceneStartEpoch: Date.now(),
};

self.onconnect = ({ ports }) => {
    const port = ports[0];
    port.start();
    port.postMessage(sceneState);
};
