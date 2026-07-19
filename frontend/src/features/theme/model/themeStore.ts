import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'dark' | 'light';

type ThemeState = {
    theme: AppTheme;
    toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        }),
        { name: 'asteroid-mining-theme' }
    )
);
