import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from './ui/GlassView';
import { useTheme } from '../context/ThemeContext';

interface AttributeData {
    material: { name: string; percent: number }[];
    fit: { name: string; percent: number }[];
    color: { name: string; percent: number }[];
}

const AttributeColumn = ({ title, items }: { title: string; items: { name: string; percent: number }[] }) => (
    <View className="flex-1 mx-1">
        <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase mb-2 text-center">{title}</Text>
        {items.slice(0, 3).map((item, index) => (
            <View key={index} className="flex-row justify-between py-1 px-2 mb-1 bg-slate-100 dark:bg-slate-800 rounded">
                <Text className="text-slate-800 dark:text-slate-200 text-xs" numberOfLines={1}>{item.name || '-'}</Text>
                <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold">{item.percent}%</Text>
            </View>
        ))}
        {items.length < 3 && [...Array(3 - items.length)].map((_, i) => (
            <View key={`empty-${i}`} className="flex-row justify-between py-1 px-2 mb-1 bg-slate-100 dark:bg-slate-800 rounded">
                <Text className="text-slate-400 dark:text-slate-500 text-xs">-</Text>
                <Text className="text-slate-400 dark:text-slate-500 text-xs">0%</Text>
            </View>
        ))}
    </View>
);

export const AttributeDistribution = ({ data }: { data: AttributeData }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { colors } = useTheme();

    return (
        <View className="mb-6">
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                className="flex-row items-center justify-between mb-3 pl-1"
            >
                <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Attribute Distribution
                </Text>
                <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            {isExpanded && (
                <GlassView intensity={10} className="p-3 rounded-xl">
                    <View className="flex-row">
                        <AttributeColumn title="Material" items={data.material} />
                        <AttributeColumn title="Fit" items={data.fit} />
                        <AttributeColumn title="Color" items={data.color} />
                    </View>
                </GlassView>
            )}
        </View>
    );
};
