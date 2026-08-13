import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SectionHeaderProps {
    title: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export const SectionHeader = ({ title, icon }: SectionHeaderProps) => {
    const { colors } = useTheme();
    return (
        <View className="flex-row items-center mb-3 mt-6 pl-1">
            {icon && <Ionicons name={icon} size={15} color={colors.accent} style={{ marginRight: 8 }} />}
            <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200">{title}</Text>
            <View className="h-[1px] bg-stone-200 dark:bg-stone-700 flex-1 ml-4" />
        </View>
    );
};