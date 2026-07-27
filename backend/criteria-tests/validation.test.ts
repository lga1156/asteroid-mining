import { getMineRequestValidationError } from '../src/middleware/validation';

const validId = '018f0000-0000-7000-8000-000000000001';

describe('getMineRequestValidationError', () => {
    it('принимает непустой массив UUID v7', () => {
        expect(getMineRequestValidationError({ asteroids: [validId] })).toBeNull();
    });

    it.each([undefined, {}, { asteroids: [] }])(
        'отклоняет отсутствие и пустой список астероидов',
        (body) => {
            expect(getMineRequestValidationError(body)).toBe('Asteroids must be a non-empty array');
        }
    );

    it('отклоняет идентификатор неверного формата', () => {
        expect(getMineRequestValidationError({ asteroids: ['not-an-id'] })).toBe(
            'Every asteroid ID must be a valid UUID v7'
        );
    });
});
