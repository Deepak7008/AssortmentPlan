import React from 'react';
import { View, Text, ScrollView } from 'react-native';
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
    const regions = [...new Set(data.map(d => d.region))];
    const classes = [...new Set(data.map(d => d.className))];

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
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                        <View className="flex-row mb-2">
                            <View style={{ width: 80 }} />
                            {regions.map(region => (
                                <View key={region} style={{ width: 64 }} className="items-center">
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase">{region}</Text>
                                </View>
                            ))}
                        </View>

                        {classes.map(cls => (
                            <View key={cls} className="flex-row mb-1">
                                <View style={{ width: 80 }} className="justify-center">
                                    <Text className="text-slate-300 text-xs font-semibold" numberOfLines={1}>{cls}</Text>
                                </View>
                                {regions.map(region => {
                                    const sales = getCellData(region, cls);
                                    const opacity = getOpacity(sales);
                                    return (
                                        <View
                                            key={region}
                                            style={{
                                                width: 60,
                                                height: 40,
                                                marginHorizontal: 2,
                                                borderRadius: 8,
                                                backgroundColor: `rgba(56, 189, 248, ${opacity})`,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text className="text-white text-[11px] font-bold">
                                                ${(sales / 1000).toFixed(0)}k
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </GradientCard>
        </View>
    );
};
