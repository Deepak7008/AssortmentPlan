import React from 'react';
import { View, Text } from 'react-native';
import { GradientCard } from './ui/GradientCard';
import clsx from 'clsx';

interface KPIData {
    salesActual: number;
    salesPlan: number;
    marginPercent: number;
    marginPlan: number;
    roi: number;
    roiPlan: number;
    sellThru: number;
    sellThruPlan: number;
}

const KPICard = ({ label, value, vsPlan, isPercent = false }: { label: string, value: string, vsPlan: number, isPercent?: boolean }) => {
    const isPositive = vsPlan >= 0;
    const changeText = vsPlan === 0 ? 'Flat' : `${isPositive ? '▲' : '▼'} ${Math.abs(vsPlan)}% vs Plan`;

    return (
        <GradientCard className="flex-1 m-1 p-4">
            <Text className="text-stone-500 dark:text-stone-400 text-xs uppercase font-sans-bold mb-1.5">{label}</Text>
            <Text className="text-stone-900 dark:text-stone-100 text-2xl font-sans-bold mb-1.5" style={{ fontVariant: ['tabular-nums'] }}>{value}</Text>
            <Text className={clsx(
                "text-[11px] font-sans-semibold",
                vsPlan === 0 ? "text-stone-400" : isPositive ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
            )}>
                {changeText}
            </Text>
        </GradientCard>
    );
};

export const LastSeasonKPIs = ({ data }: { data: KPIData }) => {
    const salesVsPlan = data.salesPlan > 0
        ? Math.round(((data.salesActual - data.salesPlan) / data.salesPlan) * 100)
        : 0;
    const marginVsPlan = Math.round(data.marginPercent - data.marginPlan);
    const roiVsPlan = data.roiPlan > 0
        ? Math.round(((data.roi - data.roiPlan) / data.roiPlan) * 100)
        : 0;
    const sellThruVsPlan = Math.round(data.sellThru - data.sellThruPlan);

    return (
        <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                Last Season Performance
            </Text>
            <View className="flex-row flex-wrap -mx-1">
                <View className="w-1/2 md:w-1/4 p-1">
                    <KPICard
                        label="Sales $"
                        value={`$${(data.salesActual / 1000).toFixed(0)}K`}
                        vsPlan={salesVsPlan}
                    />
                </View>
                <View className="w-1/2 md:w-1/4 p-1">
                    <KPICard
                        label="Margin %"
                        value={`${Math.round(data.marginPercent)}%`}
                        vsPlan={marginVsPlan}
                        isPercent
                    />
                </View>
                <View className="w-1/2 md:w-1/4 p-1">
                    <KPICard
                        label="ROI"
                        value={data.roi.toFixed(1)}
                        vsPlan={roiVsPlan}
                    />
                </View>
                <View className="w-1/2 md:w-1/4 p-1">
                    <KPICard
                        label="Sell Thru"
                        value={`${Math.round(data.sellThru)}%`}
                        vsPlan={sellThruVsPlan}
                        isPercent
                    />
                </View>
            </View>
        </View>
    );
};
