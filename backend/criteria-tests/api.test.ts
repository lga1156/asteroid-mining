import request from 'supertest';

import app from '../src/app';
import { asteroidsService } from '../src/services/asteroidsService';
import { resourcesService } from '../src/services/resourcesService';
import { cacheService } from '../src/services/cacheService';

jest.mock('../src/functions/statusById', () => ({
    statusById: jest.fn(async () => 'available'),
}));
jest.mock('../src/functions/createMining', () => ({
    createMining: jest.fn(async (asteroids: string[]) => ({
        id: '018f0000-0000-7000-8000-000000000099',
        status: 'active',
        asteroids,
    })),
}));

const asteroidId = '018f0000-0000-7000-8000-000000000001';
const summary = {
    id: asteroidId,
    name: 'Психея',
    radius: 113,
    mass: 1000,
    coordinates: { rightAscension: 1, declination: 2, distance: 3 },
};

describe('BFF API', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        cacheService.clear();
        jest.spyOn(asteroidsService, 'getAsteroidIds').mockResolvedValue({
            items: [summary],
            total: 1,
            limit: 12,
            offset: 0,
        });
        jest.spyOn(asteroidsService, 'getAsteroidById').mockResolvedValue(summary);
        jest.spyOn(resourcesService, 'getElementsList').mockResolvedValue([
            { name: 'Железо', symbol: 'Fe', slug: 'iron', kind: 'mineral' },
        ]);
        jest.spyOn(resourcesService, 'getAsteroidDetails').mockResolvedValue(`
            <cml xmlns="http://www.xml-cml.org/schema">
              <molecule id="iron">
                <name>Железо</name><name convention="yndx:slug">iron</name>
                <propertyList>
                  <property dictRef="yndx:kind"><scalar>mineral</scalar></property>
                  <property dictRef="yndx:mass"><scalar>420</scalar></property>
                  <property dictRef="yndx:superconductingThreshold"><scalar>12</scalar></property>
                </propertyList>
              </molecule>
            </cml>
        `);
    });

    it('GET /asteroids возвращает страницу астероидов со статусом 200', async () => {
        const response = await request(app).get('/asteroids?page=1&perPage=12');

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            total: 1,
            page: 1,
            perPage: 12,
            asteroids: [{ id: asteroidId, status: 'available' }],
        });
    });

    it('передаёт параметры пагинации внешнему сервису', async () => {
        await request(app).get('/asteroids?page=3&perPage=7').expect(200);

        expect(asteroidsService.getAsteroidIds).toHaveBeenCalledWith(7, 14);
    });

    it('POST /mine создаёт миссию при валидных данных', async () => {
        const response = await request(app)
            .post('/mine')
            .send({ asteroids: [asteroidId] });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ status: 'active', asteroids: [asteroidId] });
    });

    it.each([{}, { asteroids: [] }])(
        'POST /mine отклоняет отсутствие или пустой список',
        async (body) => {
            const response = await request(app).post('/mine').send(body);

            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/non-empty array/);
        }
    );

    it('возвращает 404 для неизвестного маршрута', async () => {
        await request(app).get('/unknown').expect(404);
    });
});
