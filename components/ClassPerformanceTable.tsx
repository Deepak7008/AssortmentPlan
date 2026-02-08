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
        <View className="mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
                Class Performance
            </Text>
            <GradientCard className="p-0 overflow-hidden" colors={['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)']}>
                {/* Header */}
                <View className="flex-row py-2 px-3 border-b border-slate-700/50 bg-slate-800/50">
                    <Text className="flex-[2] text-slate-400 text-[10px] font-bold uppercase">Class</Text>
                    <Text className="flex-1 text-right text-slate-400 text-[10px] font-bold uppercase">Sales</Text>
                    <Text className="flex-1 text-right text-slate-400 text-[10px] font-bold uppercase">Margin</Text>
                    <Text className="flex-1 text-right text-slate-400 text-[10px] font-bold uppercase">ROI</Text>
                </View>

                {/* Rows */}
                {data.map((row, index) => (
                    <View
                        key={row.className}
                        className={clsx(
                            "flex-row py-3 px-3 items-center",
                            index < data.length - 1 && "border-b border-slate-800/50"
                        )}
                    >
                        <View className="flex-[2]">
                            <Text className="text-white text-sm font-semibold">{row.className}</Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-white text-sm font-bold">${(row.sales / 1000).toFixed(0)}k</Text>
                            <Text className={clsx(
                                "text-[9px] font-semibold",
                                row.salesChange >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                                {row.salesChange >= 0 ? '+' : ''}{row.salesChange}%
                            </Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-white text-sm font-bold">{row.marginPercent}%</Text>
                            <Text className={clsx(
                                "text-[9px] font-semibold",
                                row.marginChange >= 0 ? "text-green-400" : row.marginChange === 0 ? "text-slate-400" : "text-red-400"
                            )}>
                                {row.marginChange === 0 ? 'Flat' : `${row.marginChange >= 0 ? '+' : ''}${row.marginChange}%`}
                            </Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Text className="text-white text-sm font-bold">{row.roi.toFixed(1)}</Text>
                        </View>
                    </View>
                ))}
            </GradientCard>
        </View>
    );
};
