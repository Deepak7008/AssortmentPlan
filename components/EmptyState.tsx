import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({ icon = 'file-tray-outline', title, message, actionLabel, onAction }: EmptyStateProps) => {
    const { colors } = useTheme();

    return (
        <View className="items-center justify-center py-14 px-8">
            <View
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                }}
            >
                <Ionicons name={icon} size={28} color={colors.textMuted} />
            </View>
            <Text className="text-stone-900 dark:text-stone-100 text-sm font-sans-bold mb-1">{title}</Text>
            {message && (
                <Text className="text-stone-500 dark:text-stone-400 text-xs text-center leading-4">{message}</Text>
            )}
            {actionLabel && onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    accessibilityRole="button"
                    className="mt-5 px-5 py-2.5 rounded-full border"
                    style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        borderColor: 'rgba(217, 119, 6, 0.4)',
                    }}
                    activeOpacity={0.7}
                >
                    <Text className="text-amber-700 dark:text-amber-400 text-xs font-sans-bold">{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};