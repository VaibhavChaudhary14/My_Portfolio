import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'sketch' | 'venom';

interface ThemeState {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'sketch',
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'sketch' ? 'venom' : 'sketch',
                })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'portfolio-theme-storage',
        }
    )
);
