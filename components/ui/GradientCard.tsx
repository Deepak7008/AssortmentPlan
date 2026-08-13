import React from 'react';
import { View, ViewProps } from 'react-native';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

interface GradientCardProps extends ViewProps {
    colors?: readonly [string, string, ...string[]];
    className?: string;
    children?: React.ReactNode;
}

/**
 * Solid surface card with hairline border and soft shadow.
 * (Kept the name/API so callers are unchanged; gradients are
 * reserved for data visualization, not card backgrounds.)
 */
export const GradientCard = ({
    colors,
    className,
    style,
    children,
    ...props
}: GradientCardProps) => {
    const { colors: themeColors } = useTheme();

    return (
        <View
            className={clsx("rounded-xl border", className)}
            style={[
                {
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                    shadowColor: '#1C1917',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 1,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
};