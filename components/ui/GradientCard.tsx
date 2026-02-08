import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewProps, View } from 'react-native';
import clsx from 'clsx';

interface GradientCardProps extends ViewProps {
    colors?: readonly [string, string, ...string[]];
    className?: string;
    children?: React.ReactNode;
}

export const GradientCard = ({
    colors = ['rgba(30, 41, 59, 0.9)', 'rgba(30, 41, 59, 0.4)'],
    className,
    style,
    children,
    ...props
}: GradientCardProps) => {
    return (
        <LinearGradient
            colors={colors}
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
