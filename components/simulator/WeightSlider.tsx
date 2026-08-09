import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../context/ThemeContext';

interface WeightSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

export const WeightSlider = ({ label, value, onChange }: WeightSliderProps) => {
    const { colors } = useTheme();

    const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v)));

    return (
        <View className="flex-1 mb-4 md:mb-0 md:px-3">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    {label}
                </Text>
                <View className="flex-row items-center">
                    <TextInput
                        value={String(value)}
                        onChangeText={t => {
                            const parsed = parseInt(t, 10);
                            if (!isNaN(parsed)) onChange(clamp(parsed));
                        }}
                        keyboardType="numeric"
                        className="text-slate-900 dark:text-white text-xs font-bold"
                        style={{ width: 36, textAlign: 'right', outlineStyle: 'none' as any }}
                    />
                    <Text className="text-slate-400 dark:text-slate-500 text-xs font-semibold ml-0.5">%</Text>
                </View>
            </View>
            <Slider
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={value}
                onValueChange={onChange}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.track}
                thumbTintColor={colors.accent}
                style={{ height: 32, width: '100%' }}
            />
        </View>
    );
};
