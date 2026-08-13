import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export const DocsButton = () => {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => router.push('/about')}
            accessibilityLabel="About and help"
            className="flex-row items-center bg-white dark:bg-stone-800 w-9 h-9 justify-center rounded-lg border border-stone-200 dark:border-stone-700 mr-2"
        >
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );
};
