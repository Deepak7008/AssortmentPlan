import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GradientCard } from '../ui/GradientCard';
import { SimulationResult } from '../../services/simulationService';

interface CalculationPanelProps {
    result: SimulationResult | null;
    expanded: boolean;
    onToggle: () => void;
}

export const CalculationPanel = ({ result, expanded, onToggle }: CalculationPanelProps) => {
    return (
        <GradientCard className="p-4">
            <TouchableOpacity onPress={onToggle} activeOpacity={0.7} className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-slate-900 dark:text-white text-sm font-bold">
                        How Was This Calculated?
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                        Step-by-step walkthrough of the simulation math.
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold mr-1">
                        {expanded ? 'Hide Calculation' : 'Show Calculation'}
                    </Text>
                    <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold">
                        {expanded ? '▲' : '▼'}
                    </Text>
                </View>
            </TouchableOpacity>

            {expanded && result && (
                <View className="mt-4">
                    {result.steps.map((step, index) => (
                        <View key={step.label} className="flex-row mb-4 last:mb-0">
                            <View className="w-[120px] pr-3">
                                <View className="flex-row items-start mb-1">
                                    <View className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-500/20 items-center justify-center mr-1.5 mt-0.5">
                                        <Text className="text-sky-700 dark:text-sky-400 text-[10px] font-bold">
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <Text className="text-slate-800 dark:text-slate-100 text-[12px] font-bold leading-5 flex-1">
                                        {step.label}
                                    </Text>
                                </View>
                                {step.formula && (
                                    <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-mono leading-4">
                                        {step.formula}
                                    </Text>
                                )}
                            </View>
                            <View className="flex-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                                {step.lines.map(line => (
                                    <Text key={line} className="text-slate-700 dark:text-slate-200 text-xs leading-5 font-mono">
                                        {line}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ))}

                    <View className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                        <Text className="text-slate-900 dark:text-white text-[13px] font-bold mb-1.5">
                            Simulation Summary
                        </Text>
                        <Text className="text-slate-700 dark:text-slate-200 text-xs leading-6">
                            {result.summary}
                        </Text>
                    </View>
                </View>
            )}

            {expanded && !result && (
                <Text className="text-slate-400 dark:text-slate-500 text-xs text-center py-6">
                    Run a simulation to see the calculation walkthrough.
                </Text>
            )}
        </GradientCard>
    );
};
