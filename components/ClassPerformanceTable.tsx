import React from 'react';
import { View, Text } from 'react-native';
import { GradientCard } from './ui/GradientCard';
import clsx from 'clsx';

interface ClassData {
    className: string;
    sales: number;
    marginPercent: number;
    roi: number;
    salesChange: number;
    marginChange: number;
}

export const ClassPerformanceTable = ({ data }: { data: ClassData[] }) => {
    return (
        <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                Class Performance
            </Text>
            <GradientCard className="p-0 overflow-hidden">
                {/* Header */}
                <View className="flex-row py-2 px-3 border-b border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/60">
                    <Text className="flex-[2] text-stone-500 dark:text-stone-400 text-[10px] font-sans-bold uppercase">Class</Text>
                    <Text className="flex-1 text-right text-stone-500 dark:text-stone-400 text-[10px] font-sans-bold uppercase">Sales</Text>
                    <Text className="flex-1 text-right text-stone-500 dark:text-stone-400 text-[10px] font-sans-bold uppercase">Margin</Text>
                    <Text className="flex-1 text-right text-stone-500 dark:text-stone-400 text-[10px] font-sans-bold uppercase">ROI</Text>
                </View>

                {/* Rows */}
                {data.map((row, index) => (
                    <View
                        key={row.className}
                        className={clsx(
                            "flex-row py-3 px-3 items-center",
                            index < data.length - 1 && "border-b border-stone-200 dark:border-stone-700"
                        )}
                    >
                        <View className="flex-[2]">
                            <Text className="text-stone-900 dark:text-stone-100 text-sm font-sans-semibold">{row.className}</Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-stone-900 dark:text-stone-100 text-sm font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>${(row.sales / 1000).toFixed(0)}k</Text>
                            <Text className={clsx(
                                "text-[9px] font-sans-semibold",
                                row.salesChange >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                            )}>
                                {row.salesChange >= 0 ? '+' : ''}{row.salesChange}%
                            </Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-stone-900 dark:text-stone-100 text-sm font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>{row.marginPercent}%</Text>
                            <Text className={clsx(
                                "text-[9px] font-sans-semibold",
                                row.marginChange >= 0 ? "text-green-700 dark:text-green-400" : row.marginChange === 0 ? "text-stone-400" : "text-red-700 dark:text-red-400"
                            )}>
                                {row.marginChange === 0 ? 'Flat' : `${row.marginChange >= 0 ? '+' : ''}${row.marginChange}%`}
                            </Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-stone-900 dark:text-stone-100 text-sm font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>{row.roi.toFixed(1)}</Text>
                        </View>
                    </View>
                ))}
            </GradientCard>
        </View>
    );
};
