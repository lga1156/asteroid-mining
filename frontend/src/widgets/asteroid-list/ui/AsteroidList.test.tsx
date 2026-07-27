import { ThemeProvider } from '@gravity-ui/uikit';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { asteroidFixture } from '../../../test/fixtures';
import { createAsteroidId } from '../../../types/domain';
import { AsteroidList } from './AsteroidList';

describe('AsteroidList', () => {
    it('рендерит каждую переданную карточку', () => {
        render(
            <ThemeProvider>
                <AsteroidList
                    asteroids={[
                        asteroidFixture,
                        {
                            ...asteroidFixture,
                            id: createAsteroidId('018f0000-0000-7000-8000-000000000002'),
                            name: 'Икар',
                        },
                    ]}
                />
            </ThemeProvider>
        );

        expect(screen.getByRole('heading', { name: 'Психея' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Икар' })).toBeInTheDocument();
    });
});
