import React from 'react';
import { View, Text } from 'react-native';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
    <View className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <View className="w-full md:flex-1 md:pr-4">
            <Text className="text-stone-900 dark:text-stone-100 text-2xl md:text-3xl font-display">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-stone-600 dark:text-stone-300 text-xs mt-1 leading-4">
                    {subtitle}
                </Text>
            )}
        </View>
        {actions && (
            <View className="w-full md:w-auto flex-row items-center justify-end flex-wrap gap-2">
                {actions}
            </View>
        )}
    </View>
);