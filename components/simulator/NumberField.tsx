import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface NumberFieldProps {
    label: string;
    hint?: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    prefix?: string;
    suffix?: string;
    baseText?: string;
}

export const NumberField = ({
    label,
    hint,
    value,
    onChangeText,
    keyboardType = 'numeric',
    prefix,
    suffix,
    baseText,
}: NumberFieldProps) => {
    const { colors } = useTheme();
    const [showHint, setShowHint] = useState(false);

    return (
        <View>
            <View className="flex-row items-center mb-1">
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    {label}
                </Text>
                {hint && (
                    <TouchableOpacity
                        onPress={() => setShowHint(v => !v)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons
                            name="information-circle-outline"
                            size={13}
                            color={colors.textMuted}
                            style={{ marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.track,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                }}
            >
                {prefix && <Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold mr-1">{prefix}</Text>}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    className="flex-1 text-slate-900 dark:text-white text-sm font-bold py-0"
                    style={{ outlineStyle: 'none' as any }}
                    placeholderTextColor={colors.textMuted}
                />
                {suffix && <Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold ml-1">{suffix}</Text>}
            </View>

            {baseText && (
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-medium mt-1.5">
                    {baseText}
                </Text>
            )}

            {showHint && hint && (
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] leading-4 mt-1.5">
                    {hint}
                </Text>
            )}
        </View>
    );
};
