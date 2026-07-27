import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { asteroidFixture } from '../../../test/fixtures';
import { getResourceTheme, ResourceBadge } from './ResourceBadge';

describe('ResourceBadge', () => {
    it.each([
        ['mineral', 'utility'],
        ['liquid', 'warning'],
        ['gas', 'info'],
    ] as const)('выбирает тему %s-ресурса', (kind, theme) => {
        expect(getResourceTheme({ kind })).toBe(theme);
    });

    it.each(
        asteroidFixture.resources.map((resource) => [resource, getResourceTheme(resource)] as const)
    )('применяет цветовую тему ресурса', (resource, theme) => {
        render(<ResourceBadge resource={resource} />);

        expect(screen.getByTitle(new RegExp(resource.name)).className).toContain(
            `g-label_theme_${theme}`
        );
    });
});
