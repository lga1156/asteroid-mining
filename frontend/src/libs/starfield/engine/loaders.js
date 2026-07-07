const cache = new Map();

const FETCH_CHAR_MIN_DELAY_MS = 20;
const FETCH_CHAR_MAX_DELAY_MS = 50;
const FETCH_CHAR_ERROR_RATE = 0.05;

function getContent(url) {
    if (cache.has(url)) return Promise.resolve(cache.get(url));
    return fetch(url)
        .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
            return r.text();
        })
        .then((text) => {
            cache.set(url, text);
            return text;
        });
}

export function fetchSize(url, callback) {
    getContent(url)
        .then((text) => callback(null, text.length))
        .catch((err) => callback(err));
}

export function fetchChar(url, index, callback) {
    getContent(url)
        .then((text) => {
            const delay =
                FETCH_CHAR_MIN_DELAY_MS +
                Math.random() * (FETCH_CHAR_MAX_DELAY_MS - FETCH_CHAR_MIN_DELAY_MS);
            setTimeout(() => {
                if (Math.random() < FETCH_CHAR_ERROR_RATE) {
                    callback(new Error(`read error at index ${index}`));
                    return;
                }
                callback(null, text[index]);
            }, delay);
        })
        .catch((err) => callback(err));
}
