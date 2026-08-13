import React, { useEffect } from 'react';
import { View, ViewStyle, DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface SkeletonProps {
    width?: DimensionValue;
    height?: number;
    radius?: number;
    style?: ViewStyle;
}

export const Skeleton = ({ width = '100%', height = 16, radius = 8, style }: SkeletonProps) => {
    const { colors } = useTheme();
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 700 }),
                withTiming(0.4, { duration: 700 })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View
            style={[
                { width, height, borderRadius: radius, backgroundColor: colors.track },
                animatedStyle,
                style,
            ]}
        />
    );
};

export const SkeletonItemCard = () => (
    <View style={{ width: '48%', marginBottom: 12 }}>
        <Skeleton height={140} radius={12} style={{ marginBottom: 8 }} />
        <Skeleton height={12} width="70%" radius={4} style={{ marginBottom: 6 }} />
        <Skeleton height={10} width="50%" radius={4} />
    </View>
);