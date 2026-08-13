import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientCard } from './ui/GradientCard';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export interface RegionSummary {
    region: string;
    sales: number;
    avgMargin: number;
    avgSellThru: number;
    itemCount: number;
}

interface TopRegionsProps {
    data: RegionSummary[];
}

const BAR_COLORS: [string, string][] = [
    ['#f59e0b', '#fbbf24'],
    ['#d97706', '#f59e0b'],
    ['#78716c', '#a8a29e'],
];

export const TopRegions = ({ data }: TopRegionsProps) => {
    const { colors } = useTheme();
    const sorted = [...data].sort((a, b) => b.sales - a.sales);
    const maxSales = Math.max(...sorted.map(d => d.sales), 1);

    return (
        <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                Top Regions
            </Text>
            <GradientCard className="p-3">
                {sorted.length === 0 && (
                    <Text className="text-stone-400 dark:text-stone-500 text-xs text-center py-4">
                        No data for selected filters
                    </Text>
                )}
                {sorted.map((region, index) => {
                    const percent = (region.sales / maxSales) * 100;
                    const colorsIdx = Math.min(index, BAR_COLORS.length - 1);
                    return (
                        <View
                            key={region.region}
                            className={clsx(
                                "flex-row items-center py-2.5",
                                index < sorted.length - 1 && "border-b border-stone-200/60 dark:border-stone-700/60"
                            )}
                        >
                            <View
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    marginRight: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: index < 3 ? `${BAR_COLORS[colorsIdx][1]}2a` : 'transparent',
                                    borderWidth: index < 3 ? 1 : 0,
                                    borderColor: index < 3 ? `${BAR_COLORS[colorsIdx][1]}66` : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        color: index < 3 ? BAR_COLORS[colorsIdx][1] : colors.textMuted,
                                        fontSize: 10,
                                        fontFamily: 'Inter_800ExtraBold',
                                    }}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-stone-900 dark:text-stone-100 text-xs font-sans-bold">{region.region}</Text>
                                    <Text
                                        className="text-stone-900 dark:text-white text-xs font-sans-bold"
                                        style={{ fontVariant: ['tabular-nums'] }}
                                    >
                                        ${(region.sales / 1000).toFixed(1)}k
                                    </Text>
                                </View>
                                <View className="h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                                    <LinearGradient
                                        colors={BAR_COLORS[colorsIdx]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ width: `${percent}%`, height: '100%', borderRadius: 999 }}
                                    />
                                </View>
                                <View className="flex-row mt-1">
                                    <Text className="text-stone-400 dark:text-stone-500 text-[9px] font-sans-semibold mr-3">
                                        Margin {region.avgMargin}%
                                    </Text>
                                    <Text className="text-stone-400 dark:text-stone-500 text-[9px] font-sans-semibold mr-3">
                                        Sell Thru {region.avgSellThru}%
                                    </Text>
                                    <Text className="text-stone-400 dark:text-stone-500 text-[9px] font-sans-semibold">
                                        {region.itemCount} items
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </GradientCard>
        </View>
    );
};
