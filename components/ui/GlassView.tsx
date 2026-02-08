import React from 'react';
import { BlurView } from 'expo-blur';
import { ViewProps, Platform, View } from 'react-native';
import clsx from 'clsx';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    className?: string;
    children?: React.ReactNode;
}

export const GlassView = ({ intensity = 20, className, style, children, ...props }: GlassViewProps) => {
    // Android doesn't support BlurView as well as iOS, so we might need a fallback or lighter touch
    const isAndroid = Platform.OS === 'android';

    if (isAndroid) {
        // Fallback for Android: Semi-transparent background
        return (
            <View
                className={clsx("bg-slate-900/90 border border-glass-border", className)}
                style={style}
                {...props}
            >
                {children}
            </View>
        );
    }

    return (
        <BlurView
            intensity={intensity}
            tint="dark"
            className={clsx("overflow-hidden border border-glass-border bg-slate-900/60", className)}
            style={style}
            {...props}
        >
            {children}
        </BlurView>
    );
};
