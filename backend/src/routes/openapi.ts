import type { OpenAPIV3 } from 'openapi-types';

export const openapiDocument: OpenAPIV3.Document = {
    openapi: '3.0.3',
    info: {
        title: 'Asteroid Mining API',
        version: '1.0.0',
        description: 'API for managing asteroid mining operations',
    },
    servers: [{ url: 'http://localhost:5678', description: 'Development server' }],
    tags: [
        { name: 'Asteroids', description: 'Asteroid management operations' },
        { name: 'Mining', description: 'Mining operations management' },
    ],
    paths: {
        '/asteroids': {
            get: {
                summary: 'Get list of asteroids',
                description: 'Retrieve a paginated list of asteroids with their resources and mining status',
                tags: ['Asteroids'],
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        description: 'Page number for pagination (default: 1)',
                        required: false,
                        schema: {
                            type: 'integer',
                            minimum: 1,
                            default: 1,
                        },
                    },
                    {
                        name: 'perPage',
                        in: 'query',
                        description: 'Number of items per page',
                        required: false,
                        schema: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 100,
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response with asteroid list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/AsteroidResponse',
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/mine': {
            post: {
                summary: 'Create mining operation',
                description: 'Start a new mining operation for specified asteroids',
                tags: ['Mining'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/MiningRequest',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Mining operation created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MiningResponse',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Bad request',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            BaseResource: {
                type: 'object',
                required: ['id', 'name', 'symbol', 'slug'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique resource identifier',
                    },
                    name: {
                        type: 'string',
                        description: 'Human-readable resource name',
                    },
                    symbol: {
                        type: 'string',
                        description: 'Symbolic representation of the resource',
                    },
                    slug: {
                        type: 'string',
                        description: 'Unique resource slug',
                    },
                },
            },
            MineralResource: {
                allOf: [
                    { $ref: '#/components/schemas/BaseResource' },
                    {
                        type: 'object',
                        required: ['kind', 'mass', 'superconductingThreshold'],
                        properties: {
                            kind: {
                                type: 'string',
                                enum: ['mineral'],
                                description: 'Resource type',
                            },
                            mass: {
                                type: 'number',
                                description: 'Mass in tons',
                                minimum: 0,
                            },
                            superconductingThreshold: {
                                type: 'number',
                                description: 'Temperature in Kelvin',
                                minimum: 0,
                            },
                        },
                    },
                ],
            },
            LiquidResource: {
                allOf: [
                    { $ref: '#/components/schemas/BaseResource' },
                    {
                        type: 'object',
                        required: ['kind', 'volume', 'volatility'],
                        properties: {
                            kind: {
                                type: 'string',
                                enum: ['liquid'],
                                description: 'Resource type',
                            },
                            volume: {
                                type: 'number',
                                description: 'Volume in liters',
                                minimum: 0,
                            },
                            volatility: {
                                type: 'number',
                                description: 'Pressure in Pascals at which liquid evaporates',
                                minimum: 0,
                            },
                        },
                    },
                ],
            },
            GasResource: {
                allOf: [
                    { $ref: '#/components/schemas/BaseResource' },
                    {
                        type: 'object',
                        required: ['kind', 'volume', 'volatility'],
                        properties: {
                            kind: {
                                type: 'string',
                                enum: ['gas'],
                                description: 'Resource type',
                            },
                            volume: {
                                type: 'number',
                                description: 'Volume in cubic meters',
                                minimum: 0,
                            },
                            volatility: {
                                type: 'number',
                                description: 'Pressure in Pascals at which gas decomposes',
                                minimum: 0,
                            },
                        },
                    },
                ],
            },
            Resource: {
                oneOf: [
                    { $ref: '#/components/schemas/MineralResource' },
                    { $ref: '#/components/schemas/LiquidResource' },
                    { $ref: '#/components/schemas/GasResource' },
                ],
                discriminator: {
                    propertyName: 'kind',
                    mapping: {
                        mineral: '#/components/schemas/MineralResource',
                        liquid: '#/components/schemas/LiquidResource',
                        gas: '#/components/schemas/GasResource',
                    },
                },
            },
            Asteroid: {
                type: 'object',
                required: ['id', 'resources'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique asteroid identifier',
                    },
                    resources: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Resource',
                        },
                        description: 'List of resources available on the asteroid',
                    },
                },
            },
            AsteroidStatus: {
                type: 'string',
                enum: ['active', 'done', 'available'],
                description: 'Mining status of an asteroid',
            },
            AsteroidResponse: {
                type: 'object',
                description: 'Страница списка астероидов: срез `asteroids` + метаданные пагинации.',
                properties: {
                    asteroids: {
                        type: 'array',
                        items: {
                            allOf: [
                                { $ref: '#/components/schemas/Asteroid' },
                                {
                                    type: 'object',
                                    required: ['status'],
                                    properties: {
                                        status: {
                                            $ref: '#/components/schemas/AsteroidStatus',
                                        },
                                    },
                                },
                            ],
                        }
                    },
                    total: {
                        type: 'integer',
                        description: 'Общее число астероидов во внешнем API',
                        example: 200,
                    },
                    page: { type: 'integer', description: 'Применённый номер страницы', example: 20 },
                    perPage: { type: 'integer', description: 'Примененное количество астероидов на странице', example: 0 },
                },
                required: ['asteroids', 'total'],
            },
            MiningRequest: {
                type: 'object',
                required: ['asteroids'],
                properties: {
                    asteroids: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        minItems: 1,
                        description: 'Array of asteroid IDs to mine',
                        example: ['asteroid-001', 'asteroid-002'],
                    },
                },
            },
            MiningStatus: {
                type: 'string',
                enum: ['active', 'done'],
                description: 'Status of a mining operation',
            },
            Mining: {
                type: 'object',
                required: ['id', 'status', 'ttl'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique mining operation identifier',
                    },
                    status: {
                        $ref: '#/components/schemas/MiningStatus',
                    },
                    ttl: {
                        type: 'integer',
                        description: 'Time to live in milliseconds',
                        minimum: 0,
                    },
                },
            },
            MiningResponse: {
                type: 'object',
                required: ['id', 'asteroids'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique mining operation identifier',
                    },
                    asteroids: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Array of asteroid IDs being mined',
                    },
                },
            },
            Error: {
                type: 'object',
                required: ['error'],
                properties: {
                    error: {
                        type: 'string',
                        description: 'Error message',
                    },
                    code: {
                        type: 'integer',
                        description: 'Error code',
                        example: 500,
                    },
                },
            },
        },
        responses: {
            BadRequest: {
                description: 'Bad request',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
            NotFound: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
            InternalServerError: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                        },
                    },
                },
            },
        },
    },
};
