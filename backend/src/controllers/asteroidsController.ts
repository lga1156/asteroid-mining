/**
 * AsteroidsController - Handle /asteroids requests.
 */

import { Request, Response, NextFunction } from 'express';
import { asteroidsService } from '../services/asteroidsService';
import { resourcesService } from '../services/resourcesService';
import { xmlService } from '../services/xmlService';
import { cacheService } from '../services/cacheService';
import { statusById } from '../functions/statusById';
import { Asteroid, AsteroidSummary, Element, ParsedResource, Resource } from '../types';
import { ASTEROIDS_CACHE_KEY_BASE, RESOURCES_CACHE_KEY_BASE } from '../config/constants';
import { HttpError } from '../middleware/errorHandler';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;

function parsePositiveInteger(value: unknown, fallback: number, maximum?: number): number {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value !== 'string' || !/^\d+$/u.test(value)) {
        throw new HttpError('Pagination parameters must be positive integers', 400);
    }
    const result = Number(value);
    if (
        !Number.isSafeInteger(result) ||
        result < 1 ||
        (maximum !== undefined && result > maximum)
    ) {
        throw new HttpError('Invalid pagination parameters', 400);
    }
    return result;
}

function enrichResource(resource: ParsedResource, elementsBySlug: Map<string, Element>): Resource {
    const element = elementsBySlug.get(resource.slug);
    return {
        ...resource,
        name: element?.name ?? resource.name,
        symbol: element?.symbol ?? resource.slug,
        slug: element?.slug ?? resource.slug,
    };
}

export class AsteroidsController {
    public async getAsteroids(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE);
            const perPage = parsePositiveInteger(req.query.perPage, DEFAULT_PER_PAGE, MAX_PER_PAGE);
            const offset = (page - 1) * perPage;
            if (!Number.isSafeInteger(offset)) {
                throw new HttpError('Invalid pagination parameters', 400);
            }

            const asteroidPage = await asteroidsService.getAsteroidIds(perPage, offset);
            const elements = await resourcesService.getElementsList();
            const elementsBySlug = new Map(elements.map((element) => [element.slug, element]));

            const asteroids = await Promise.all(
                asteroidPage.items.map(async (summary: AsteroidSummary) => {
                    const asteroidCacheKey = `${ASTEROIDS_CACHE_KEY_BASE}_${summary.id}_enriched`;
                    let asteroid = cacheService.get<Asteroid>(asteroidCacheKey);

                    if (!asteroid) {
                        const parsedResourcesCacheKey = `${RESOURCES_CACHE_KEY_BASE}_${summary.id}_parsed`;
                        let parsedResources =
                            cacheService.get<ParsedResource[]>(parsedResourcesCacheKey);
                        if (!parsedResources) {
                            const xml = await resourcesService.getAsteroidDetails(summary.id);
                            parsedResources =
                                cacheService.get<ParsedResource[]>(parsedResourcesCacheKey) ??
                                xmlService.parse(xml);
                            cacheService.set(parsedResourcesCacheKey, parsedResources);
                        }

                        asteroid = {
                            ...summary,
                            resources: parsedResources.map((resource) =>
                                enrichResource(resource, elementsBySlug)
                            ),
                        };
                        cacheService.set(asteroidCacheKey, asteroid);
                    }

                    return { ...asteroid, status: await statusById(summary.id) };
                })
            );

            res.json({
                asteroids,
                total: asteroidPage.total,
                page,
                perPage,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const asteroidsController = new AsteroidsController();
