import { SERVER_PORT, WEBSOCKET_PORT } from './constants';

describe('backend configuration', () => {
    it('provides valid default ports', () => {
        expect(SERVER_PORT).toBe(5678);
        expect(WEBSOCKET_PORT).toBe(5679);
    });
});
