import React from 'react';
import { View, ViewProps } from 'react-native';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    className?: string;
    children?: React.ReactNode;
}

/**
 * Solid surface container with a hairline border.
 * (Kept the name/API so callers are unchanged; blur/glass effects
 * are now reserved for the floating tab bar only.)
 */
export const GlassView = ({ intensity = 20, className, style, children, ...props }: GlassViewProps) => {
    const { colors } = useTheme();

    return (
        <View
            className={clsx("border", className)}
            style={[{ backgroundColor: colors.surface, borderColor: colors.border }, style]}
            {...props}
        >
            {children}
        </View>
    );
};