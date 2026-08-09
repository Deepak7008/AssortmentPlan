import React from 'react';
import { View, Text } from 'react-native';
import { GradientCard } from '../ui/GradientCard';
import { WeightSlider } from './WeightSlider';
import { ExitWeights } from '../../services/simulationService';
import clsx from 'clsx';

interface ExitFactorConfigProps {
    weights: ExitWeights;
    onWeightChange: (key: keyof ExitWeights, value: number) => void;
}

export const ExitFactorConfig = ({ weights, onWeightChange }: ExitFactorConfigProps) => {
    const total = weights.sellThru + weights.lySales + weights.margin;
    const isValid = total === 100;

    return (
        <GradientCard className="p-4">
            <View className="flex-row items-center justify-between mb-1">
                <Text className="text-slate-900 dark:text-white text-sm font-bold">
                    Exit Factor Configuration
                </Text>
                <View
                    className={clsx(
                        "px-2.5 py-1 rounded-full border",
                        isValid
                            ? "bg-green-100 dark:bg-green-500/15 border-green-300 dark:border-green-500/40"
                            : "bg-red-100 dark:bg-red-500/15 border-red-300 dark:border-red-500/40"
                    )}
                >
                    <Text className={clsx(
                        "text-[10px] font-bold",
                        isValid ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                        Total Weight: {total}%
                    </Text>
                </View>
            </View>
            <Text className="text-slate-600 dark:text-slate-300 text-[11px] mb-4">
                Define what matters most when identifying options for exit.
            </Text>

            <View className="flex-col md:flex-row">
                <WeightSlider
                    label="Sell Thru %"
                    value={weights.sellThru}
                    onChange={v => onWeightChange('sellThru', v)}
                />
                <WeightSlider
                    label="LY Sales"
                    value={weights.lySales}
                    onChange={v => onWeightChange('lySales', v)}
                />
                <WeightSlider
                    label="Margin %"
                    value={weights.margin}
                    onChange={v => onWeightChange('margin', v)}
                />
            </View>

            {!isValid && (
                <Text className="text-red-500 dark:text-red-400 text-[11px] font-semibold mt-2">
                    Weights must total exactly 100% before running a simulation.
                </Text>
            )}
        </GradientCard>
    );
};
