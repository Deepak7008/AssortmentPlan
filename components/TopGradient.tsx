import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export const TopGradient = () => {
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();
    const height = insets.top + 120;

    return (
        <View
            pointerEvents="none"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}
        >
            <LinearGradient
                colors={isDark
                    ? ['rgba(12, 74, 110, 0.55)', 'rgba(12, 74, 110, 0.25)', 'rgba(12, 74, 110, 0)']
                    : ['rgba(186, 230, 253, 0.8)', 'rgba(186, 230, 253, 0.35)', 'rgba(186, 230, 253, 0)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ flex: 1 }}
            />
        </View>
    );
};
