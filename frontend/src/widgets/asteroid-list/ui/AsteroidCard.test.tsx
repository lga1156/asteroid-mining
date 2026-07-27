import { ThemeProvider } from '@gravity-ui/uikit';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { asteroidFixture } from '../../../test/fixtures';
import { AsteroidCard } from './AsteroidCard';

describe('AsteroidCard', () => {
    it('рендерит имя, диаметр, расстояние и все иконки ресурсов', () => {
        render(
            <ThemeProvider>
                <AsteroidCard asteroid={asteroidFixture} />
            </ThemeProvider>
        );

        expect(screen.getByRole('heading', { name: 'Психея' })).toBeInTheDocument();
        expect(screen.getByText(/226,4 м/)).toBeInTheDocument();
        expect(screen.getByText(/41.?200 км/)).toBeInTheDocument();
        expect(screen.getByTitle(/Железо/)).toBeInTheDocument();
        expect(screen.getByTitle(/Вода/)).toBeInTheDocument();
        expect(screen.getByTitle(/Гелий/)).toBeInTheDocument();
    });
});
