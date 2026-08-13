import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ScrollToTopFABProps {
    visible: boolean;
    onPress: () => void;
}

export const ScrollToTopFAB = ({ visible, onPress }: ScrollToTopFABProps) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const { colors, isDark } = useTheme();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: visible ? 1 : 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: visible ? 0 : 20,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
            pointerEvents={visible ? 'auto' : 'none'}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.button, { backgroundColor: isDark ? 'rgba(41, 37, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}
            >
                <Ionicons name="arrow-up" size={20} color={colors.accent} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        zIndex: 50,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(217, 119, 6, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#B45309',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
});
