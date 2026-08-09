import React from 'react';
import { View, Text } from 'react-native';
import { GradientCard } from '../ui/GradientCard';
import { SimulationResult, fmtMoney, fmtNum, fmtPp } from '../../services/simulationService';
import clsx from 'clsx';

interface ResultsTableProps {
    result: SimulationResult | null;
}

interface RowSpec {
    key: string;
    label: string;
    format: 'money' | 'num' | 'pct' | 'pp' | 'money2';
    base: (r: SimulationResult) => number;
    sim: (r: SimulationResult) => number;
    delta: (r: SimulationResult) => number;
}

const ROWS: RowSpec[] = [
    { key: 'options', label: 'Options', format: 'num', base: r => r.base.options, sim: r => r.sim.options, delta: r => r.delta.options },
    { key: 'units', label: 'Units', format: 'num', base: r => r.base.units, sim: r => r.sim.units, delta: r => r.delta.units },
    { key: 'sales', label: 'Sales', format: 'money', base: r => r.base.sales, sim: r => r.sim.sales, delta: r => r.delta.sales },
    { key: 'margin', label: 'Margin', format: 'money', base: r => r.base.margin, sim: r => r.sim.margin, delta: r => r.delta.margin },
    { key: 'sellThru', label: 'Sell Thru %', format: 'pct', base: r => r.base.sellThru, sim: r => r.sim.sellThru, delta: r => r.delta.sellThru },
    { key: 'asp', label: 'Avg ASP', format: 'money2', base: r => r.base.asp, sim: r => r.sim.asp, delta: r => r.delta.asp },
    { key: 'avgCp', label: 'Avg CP', format: 'money2', base: r => r.base.avgCp, sim: r => r.sim.avgCp, delta: r => r.delta.avgCp },
];

const formatValue = (v: number, format: RowSpec['format']) => {
    switch (format) {
        case 'money': return fmtMoney(v);
        case 'money2': return `$${v.toFixed(2)}`;
        case 'num': return fmtNum(v);
        case 'pct': return `${v.toFixed(1)}%`;
        case 'pp': return fmtPp(v);
    }
};

export const ResultsTable = ({ result }: ResultsTableProps) => {
    return (
        <GradientCard className="p-4 overflow-hidden">
            {!result ? (
                <View className="items-center py-10">
                    <View className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-500/15 items-center justify-center mb-3">
                        <View className="w-4 h-4 rounded-sm border-2 border-sky-500" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                    <Text className="text-slate-600 dark:text-slate-300 text-sm font-bold">
                        No simulation yet
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1 text-center px-6">
                        Set your assumptions and press Run Simulation to see the impact.
                    </Text>
                </View>
            ) : (
                <View>
                    <View className="flex-row border-b border-slate-200 dark:border-slate-700 pb-2 mb-1">
                        <Text className="flex-[1.4] text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            KPI
                        </Text>
                        <Text className="flex-1 text-right text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            Base
                        </Text>
                        <Text className="flex-1 text-right text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            Simulation
                        </Text>
                        <Text className="flex-1 text-right text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            Delta
                        </Text>
                    </View>

                    {ROWS.map(row => {
                        const base = row.base(result);
                        const sim = row.sim(result);
                        const delta = row.delta(result);
                        const pct = row.key === 'sellThru'
                            ? fmtPp(delta)
                            : base !== 0
                                ? `${delta >= 0 ? '+' : '-'}${Math.abs((delta / base) * 100).toFixed(1)}%`
                                : '0.0%';
                        const isNeutral = delta === 0;

                        return (
                            <View key={row.key} className="flex-row items-center py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
                                <Text className="flex-[1.4] text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                    {row.label}
                                </Text>
                                <Text className="flex-1 text-right text-slate-700 dark:text-slate-200 text-xs font-semibold tabular-nums">
                                    {formatValue(base, row.format)}
                                </Text>
                                <Text className="flex-1 text-right text-slate-900 dark:text-white text-xs font-bold tabular-nums">
                                    {formatValue(sim, row.format)}
                                </Text>
                                <View className="flex-1 items-end">
                                    <Text className={clsx(
                                        "text-xs font-bold tabular-nums",
                                        isNeutral ? "text-slate-400 dark:text-slate-500" : delta > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {delta > 0 ? '+' : ''}{formatValue(delta, row.format)}
                                    </Text>
                                    <Text className={clsx(
                                        "text-[9px] font-semibold",
                                        isNeutral ? "text-slate-400 dark:text-slate-500" : delta > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {row.key === 'sellThru' ? pct : pct}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </GradientCard>
    );
};
