import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewProps } from 'react-native';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

interface GradientCardProps extends ViewProps {
    colors?: readonly [string, string, ...string[]];
    className?: string;
    children?: React.ReactNode;
}

export const GradientCard = ({
    colors,
    className,
    style,
    children,
    ...props
}: GradientCardProps) => {
    const { isDark } = useTheme();
    const defaultColors = isDark
        ? ['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.9)']
        : ['rgba(255, 255, 255, 0.95)', 'rgba(241, 245, 249, 0.85)'];

    return (
        <LinearGradient
            colors={colors ?? defaultColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={clsx("rounded-xl border border-glass-border overflow-hidden shadow-lg", className)}
            style={style}
            {...props as any}
        >
            {children}
        </LinearGradient>
    );
};
