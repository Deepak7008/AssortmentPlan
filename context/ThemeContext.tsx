import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = '@stratos_theme';

export interface ThemeColors {
    background: string;
    surface: string;
    surfaceAlt: string;
    card: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    track: string;
    accent: string;
    accentStrong: string;
    headerTint: string;
    headerBg: string;
    refreshBg: string;
}

const LIGHT_COLORS: ThemeColors = {
    background: '#FAFAF9',
    surface: '#ffffff',
    surfaceAlt: '#F5F5F4',
    card: '#ffffff',
    border: 'rgba(28, 25, 23, 0.1)',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
    track: '#E7E5E4',
    accent: '#B45309',
    accentStrong: '#92400E',
    headerTint: '#1C1917',
    headerBg: '#FAFAF9',
    refreshBg: '#FAFAF9',
};

const DARK_COLORS: ThemeColors = {
    background: '#1C1917',
    surface: '#292524',
    surfaceAlt: '#44403C',
    card: '#292524',
    border: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#FAFAF9',
    textSecondary: '#D6D3D1',
    textMuted: '#A8A29E',
    track: '#44403C',
    accent: '#FBBF24',
    accentStrong: '#F59E0B',
    headerTint: '#FAFAF9',
    headerBg: '#1C1917',
    refreshBg: '#292524',
};

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): Theme | null => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {
            // ignore
        }
    }
    return null;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemScheme = useColorScheme();
    const [manualTheme, setManualTheme] = useState<Theme | null>(getStoredTheme);

    // Native storage can't be read synchronously — restore the persisted
    // manual override once available (web already read it synchronously above).
    useEffect(() => {
        if (Platform.OS === 'web') return;
        AsyncStorage.getItem(STORAGE_KEY)
            .then(stored => {
                if (stored === 'dark' || stored === 'light') setManualTheme(stored);
            })
            .catch(() => { });
    }, []);

    // No manual override → follow the OS setting (live), light-first fallback.
    const theme: Theme = manualTheme ?? (systemScheme === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        if (manualTheme) {
            AsyncStorage.setItem(STORAGE_KEY, manualTheme).catch(() => { });
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, manualTheme);
            }
        } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
            // Following the system — clear any previously pinned choice.
            window.localStorage.removeItem(STORAGE_KEY);
            AsyncStorage.removeItem(STORAGE_KEY).catch(() => { });
        }
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    }, [manualTheme, theme]);

    const setTheme = (next: Theme) => setManualTheme(next);
    const toggleTheme = () => setManualTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
                colors: theme === 'light' ? LIGHT_COLORS : DARK_COLORS,
                isDark: theme === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
