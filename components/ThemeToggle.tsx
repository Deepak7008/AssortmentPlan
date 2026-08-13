import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex-row items-center bg-white dark:bg-stone-800 w-9 h-9 justify-center rounded-lg border border-stone-200 dark:border-stone-700 mr-2"
        >
            <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={18}
                color={isDark ? "#FBBF24" : "#A8A29E"}
            />
        </TouchableOpacity>
    );
};
