import { ThemeProvider } from '@gravity-ui/uikit';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
    it('показывает ссылки на все разделы приложения', () => {
        render(
            <ThemeProvider>
                <MemoryRouter>
                    <AppHeader />
                </MemoryRouter>
            </ThemeProvider>
        );

        const navigation = screen.getByRole('navigation', { name: 'Основная навигация' });
        expect(navigation).toHaveTextContent('Астероиды');
        expect(navigation).toHaveTextContent('План миссии');
        expect(navigation).toHaveTextContent('Статус добычи');
    });
});
