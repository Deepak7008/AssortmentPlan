import React from 'react';
import { View, Text } from 'react-native';
import { GradientCard } from './ui/GradientCard';

interface HeatmapCell {
    region: string;
    className: string;
    sales: number;
}

interface RegionalHeatmapProps {
    data: HeatmapCell[];
}

export const RegionalHeatmap = ({ data }: RegionalHeatmapProps) => {
    const regions = ['North', 'South', 'East'];
    const classes = ['Shirts', 'Trousers', 'Jackets'];

    const maxSales = Math.max(...data.map(d => d.sales), 1);

    const getCellData = (region: string, className: string) => {
        const cell = data.find(d => d.region === region && d.className === className);
        return cell ? cell.sales : 0;
    };

    const getOpacity = (sales: number) => {
        if (sales === 0) return 0.1;
        return Math.min(0.95, Math.max(0.15, sales / maxSales));
    };

    return (
        <View className="mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
                Regional Heatmap
            </Text>
            <GradientCard className="p-3" colors={['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)']}>
                {/* Header Row */}
                <View className="flex-row mb-2">
                    <View className="w-14" />
                    {classes.map(cls => (
                        <View key={cls} className="flex-1 items-center">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase">{cls}</Text>
                        </View>
                    ))}
                </View>

                {/* Data Rows */}
                {regions.map(region => (
                    <View key={region} className="flex-row mb-1">
                        <View className="w-14 justify-center">
                            <Text className="text-slate-300 text-xs font-semibold">{region}</Text>
                        </View>
                        {classes.map(cls => {
                            const sales = getCellData(region, cls);
                            const opacity = getOpacity(sales);
                            return (
                                <View
                                    key={cls}
                                    className="flex-1 mx-0.5 h-12 rounded-lg items-center justify-center"
                                    style={{
                                        backgroundColor: `rgba(56, 189, 248, ${opacity})`,
                                    }}
                                >
                                    <Text className="text-white text-xs font-bold">
                                        ${(sales / 1000).toFixed(0)}k
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </GradientCard>
        </View>
    );
};
