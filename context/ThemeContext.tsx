import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
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
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    card: '#ffffff',
    border: 'rgba(15, 23, 42, 0.08)',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    track: '#e2e8f0',
    accent: '#0284c7',
    accentStrong: '#0ea5e9',
    headerTint: '#0f172a',
    headerBg: '#f8fafc',
    refreshBg: '#f8fafc',
};

const DARK_COLORS: ThemeColors = {
    background: '#020617',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    card: '#0f172a',
    border: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    track: '#1e293b',
    accent: '#38bdf8',
    accentStrong: '#0ea5e9',
    headerTint: '#ffffff',
    headerBg: '#020617',
    refreshBg: '#0f172a',
};

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {
            // ignore
        }
    }
    return 'dark';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, theme).catch(() => { });
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    }, [theme]);

    const setTheme = (next: Theme) => setThemeState(next);
    const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));

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
