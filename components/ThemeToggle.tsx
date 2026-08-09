import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            className="flex-row items-center bg-white dark:bg-slate-800 w-9 h-9 justify-center rounded-lg border border-slate-200 dark:border-slate-700 mr-2"
        >
            <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={18}
                color={isDark ? "#38bdf8" : "#64748b"}
            />
        </TouchableOpacity>
    );
};
