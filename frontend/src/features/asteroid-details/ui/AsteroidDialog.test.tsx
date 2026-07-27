import { ThemeProvider } from '@gravity-ui/uikit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { asteroidFixture } from '../../../test/fixtures';
import { AsteroidDialog, formatNumber } from './AsteroidDialog';

describe('formatNumber', () => {
    it('форматирует число по русской локали и округляет до одного знака', () => {
        expect(formatNumber(12345.67)).toBe('12 345,7');
    });
});

describe('AsteroidDialog', () => {
    function renderDialog(props: Partial<React.ComponentProps<typeof AsteroidDialog>> = {}) {
        const onClose = props.onClose ?? vi.fn();
        render(
            <ThemeProvider>
                <AsteroidDialog
                    asteroid={props.asteroid ?? asteroidFixture}
                    open={props.open ?? true}
                    onClose={onClose}
                />
            </ThemeProvider>
        );
        return { onClose };
    }

    it('показывает характеристики и подробности ресурсов, когда открыт', () => {
        renderDialog();

        expect(screen.getByText('Психея')).toBeInTheDocument();
        expect(screen.getByText('Ресурсы астероида')).toBeInTheDocument();
        expect(screen.getByText('Масса')).toBeInTheDocument();
        expect(screen.getAllByText('Объём')).toHaveLength(2);
        expect(screen.getByText('Порог сверхпроводимости')).toBeInTheDocument();
    });

    it('вызывает onClose по кнопке закрытия', async () => {
        const onClose = vi.fn();
        renderDialog({ onClose });

        await userEvent.click(screen.getByRole('button', { name: /close dialog/i }));

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('показывает пустое состояние без ресурсов', () => {
        renderDialog({ asteroid: { ...asteroidFixture, resources: [] } });

        expect(screen.getByText('Ресурсы не найдены')).toBeInTheDocument();
    });
});
