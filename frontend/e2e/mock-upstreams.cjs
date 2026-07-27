const http = require('node:http');
const process = require('node:process');
const { URL } = require('node:url');

const asteroids = [
    '018f0000-0000-7000-8000-000000000001',
    '018f0000-0000-7000-8000-000000000002',
    '018f0000-0000-7000-8000-000000000003',
].map((id, index) => ({
    id,
    name: `Тестовый астероид ${index + 1}`,
    radius: 113 + index,
    mass: 1000 + index,
    coordinates: { rightAscension: 1, declination: 2, distance: 3 + index },
}));

const cml = `<?xml version="1.0"?>
<cml xmlns="http://www.xml-cml.org/schema">
  <molecule id="iron">
    <name>Железо</name>
    <name convention="yndx:slug">iron</name>
    <propertyList>
      <property dictRef="yndx:kind"><scalar>mineral</scalar></property>
      <property dictRef="yndx:mass"><scalar>420</scalar></property>
      <property dictRef="yndx:superconductingThreshold"><scalar>12</scalar></property>
    </propertyList>
  </molecule>
  <molecule id="water">
    <name>Вода</name>
    <name convention="yndx:slug">water</name>
    <propertyList>
      <property dictRef="yndx:kind"><scalar>liquid</scalar></property>
      <property dictRef="yndx:volume"><scalar>800</scalar></property>
      <property dictRef="yndx:volatility"><scalar>611</scalar></property>
    </propertyList>
  </molecule>
</cml>`;

function json(response, value) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(value));
}

const asteroidsServer = http.createServer((request, response) => {
    if (request.url?.startsWith('/asteroids/')) {
        const id = request.url.slice('/asteroids/'.length);
        const asteroid = asteroids.find((item) => item.id === id);
        if (asteroid) {
            return json(response, asteroid);
        }
        return response.writeHead(404).end();
    }
    if (request.url?.startsWith('/asteroids')) {
        const url = new URL(request.url, 'http://localhost');
        const limit = Number(url.searchParams.get('limit') ?? 20);
        const offset = Number(url.searchParams.get('offset') ?? 0);
        return json(response, { items: asteroids, total: asteroids.length, limit, offset });
    }
    response.writeHead(404).end();
});

const resourcesServer = http.createServer((request, response) => {
    if (request.url === '/elements') {
        return json(response, [
            { name: 'Железо', symbol: 'Fe', slug: 'iron', kind: 'mineral' },
            { name: 'Вода', symbol: 'H₂O', slug: 'water', kind: 'liquid' },
        ]);
    }
    if (request.url?.startsWith('/composition/')) {
        response.writeHead(200, { 'Content-Type': 'application/xml' });
        return response.end(cml);
    }
    response.writeHead(404).end();
});

asteroidsServer.listen(4101, '127.0.0.1');
resourcesServer.listen(4102, '127.0.0.1');

function shutdown() {
    asteroidsServer.close();
    resourcesServer.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
