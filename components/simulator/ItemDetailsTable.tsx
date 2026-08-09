import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GradientCard } from '../ui/GradientCard';
import {
    SimulationResult, ExitWeights, RankedItem, SimItem,
    fmtMoney, fmtNum, fmtFactor,
    computeExitFactors, DEFAULT_WEIGHTS,
} from '../../services/simulationService';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

interface ItemDetailsTableProps {
    items: SimItem[];
    result: SimulationResult | null;
    weights: ExitWeights;
    expanded: boolean;
    onToggle: () => void;
}

const ACTION_STYLES: Record<string, { text: string; bg: string; border: string }> = {
    KEEP: { text: '#16a34a', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.4)' },
    EXIT: { text: '#dc2626', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.4)' },
    NEW: { text: '#0284c7', bg: 'rgba(14, 165, 233, 0.12)', border: 'rgba(14, 165, 233, 0.4)' },
};

interface ColumnSpec {
    key: string;
    label: string;
    flex: number;
    align: 'left' | 'right';
}

const COLUMNS: ColumnSpec[] = [
    { key: 'name', label: 'Item', flex: 1.5, align: 'left' },
    { key: 'units', label: 'Units', flex: 1, align: 'right' },
    { key: 'cp', label: 'CP', flex: 1, align: 'right' },
    { key: 'sp', label: 'SP', flex: 1, align: 'right' },
    { key: 'margin', label: 'Margin', flex: 1, align: 'right' },
    { key: 'sellThru', label: 'Sell Thru', flex: 1, align: 'right' },
    { key: 'lySales', label: 'LY Sales', flex: 1, align: 'right' },
    { key: 'factor', label: 'Exit Factor', flex: 1, align: 'right' },
    { key: 'rank', label: 'Rank', flex: 0.6, align: 'right' },
    { key: 'action', label: 'Action', flex: 1, align: 'right' },
];

const Breakdown = ({ entry, weights }: { entry: RankedItem; weights: ExitWeights }) => {
    const { colors } = useTheme();
    const rows = [
        { label: 'Sell Thru', raw: `${entry.item.sellThru}%`, avg: `${entry.stAvg.toFixed(1)}%`, score: entry.stScore, weight: weights.sellThru },
        { label: 'LY Sales', raw: fmtMoney(entry.item.lySales), avg: fmtMoney(entry.lyAvg), score: entry.lyScore, weight: weights.lySales },
        { label: 'Margin %', raw: `${entry.marginPercent.toFixed(1)}%`, avg: `${entry.marginAvg.toFixed(1)}%`, score: entry.marginScore, weight: weights.margin },
    ];

    return (
        <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 12, marginTop: 8 }}>
            <Text className="text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                Exit Factor Breakdown
            </Text>
            {rows.map(row => (
                <View key={row.label} className="flex-row items-center justify-between mb-1">
                    <Text className="text-slate-700 dark:text-slate-200 text-xs font-medium flex-1">
                        {row.label}: {row.raw}{' '}
                        <Text className="text-slate-500 dark:text-slate-400">
                            (class avg {row.avg})
                        </Text>
                    </Text>
                    <Text className="text-slate-900 dark:text-slate-100 text-xs font-bold tabular-nums">
                        {row.score.toFixed(2)} × {row.weight}% = {(row.score * row.weight / 100).toFixed(3)}
                    </Text>
                </View>
            ))}
            <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <Text className="text-slate-700 dark:text-slate-200 text-xs font-bold">
                    Exit Factor
                </Text>
                <Text className="text-sky-600 dark:text-sky-400 text-xs font-extrabold tabular-nums">
                    {fmtFactor(entry.exitFactor)}
                </Text>
            </View>
        </View>
    );
};

const ActionChip = ({ entry, hasResult }: { entry: RankedItem; hasResult: boolean }) => {
    if (!hasResult) {
        return <Text className="text-slate-400 dark:text-slate-500 text-[11px] font-bold">—</Text>;
    }
    const sc = ACTION_STYLES[entry.action];
    return (
        <View style={{
            backgroundColor: sc.bg,
            borderColor: sc.border,
            borderWidth: 1,
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
            alignSelf: 'flex-end',
        }}>
            <Text style={{ color: sc.text, fontSize: 9, fontWeight: '800' }}>{entry.action}</Text>
        </View>
    );
};

export const ItemDetailsTable = ({ items, result, weights, expanded, onToggle }: ItemDetailsTableProps) => {
    const { colors } = useTheme();
    const [openRank, setOpenRank] = useState<number | null>(null);

    const hasResult = result !== null;
    // Static preview until a simulation is run: factors/ranks from the default weights.
    const previewRanked = useMemo(() => computeExitFactors(items, DEFAULT_WEIGHTS), [items]);
    const ranked = useMemo(
        () => [...(hasResult ? result.ranked : previewRanked)].sort((a, b) => a.rank - b.rank),
        [hasResult, result, previewRanked]
    );
    const breakdownWeights = hasResult ? weights : DEFAULT_WEIGHTS;

    const summary = !hasResult
        ? `${items.length} items in assortment — Run Simulation to assign actions`
        : result.addedOptions > 0
            ? `No items marked for exit · ${result.addedOptions} new option${result.addedOptions > 1 ? 's' : ''} to be introduced`
            : `${result.exited.length} item${result.exited.length !== 1 ? 's' : ''} marked for exit · ${result.kept.length} item${result.kept.length !== 1 ? 's' : ''} retained`;

    const cellText = (entry: RankedItem, key: string): string => {
        switch (key) {
            case 'name': return entry.item.name;
            case 'units': return fmtNum(entry.item.units);
            case 'cp': return `$${entry.item.cp.toFixed(2)}`;
            case 'sp': return `$${entry.item.sp.toFixed(2)}`;
            case 'margin': return `${entry.marginPercent.toFixed(1)}%`;
            case 'sellThru': return `${entry.item.sellThru}%`;
            case 'lySales': return fmtMoney(entry.item.lySales);
            case 'factor': return fmtFactor(entry.exitFactor);
            case 'rank': return String(entry.rank);
            default: return '';
        }
    };

    return (
        <GradientCard className="p-4 overflow-hidden">
            <TouchableOpacity onPress={onToggle} activeOpacity={0.7} className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-slate-900 dark:text-white text-sm font-bold">
                        Item Level Details
                    </Text>
                    <Text className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                        {summary}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold mr-1">
                        {expanded ? 'Hide Details' : 'Show Details'}
                    </Text>
                    <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold">
                        {expanded ? '▲' : '▼'}
                    </Text>
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={{ marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                    <View className="flex-row px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                        {COLUMNS.map(col => (
                            <Text
                                key={col.key}
                                className={clsx(
                                    "text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-wider",
                                    col.align === 'right' && "text-right"
                                )}
                                style={{ flex: col.flex }}
                            >
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {ranked.map(entry => (
                        <View key={entry.item.name}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setOpenRank(openRank === entry.rank ? null : entry.rank)}
                                className="flex-row px-3 py-2.5 items-center border-b border-slate-100 dark:border-slate-800/60"
                            >
                                {COLUMNS.map(col => (
                                    <View key={col.key} style={{ flex: col.flex }} className={clsx(col.align === 'right' && "items-end")}>
                                        {col.key === 'action' ? (
                                            <ActionChip entry={entry} hasResult={hasResult} />
                                        ) : (
                                            <Text
                                                className={clsx(
                                                    "text-[11px] tabular-nums",
                                                    col.key === 'name'
                                                        ? "text-slate-900 dark:text-slate-100 font-semibold"
                                                        : col.key === 'factor'
                                                            ? "text-slate-900 dark:text-white font-bold"
                                                            : "text-slate-700 dark:text-slate-200 font-medium",
                                                    col.align === 'right' && "text-right"
                                                )}
                                            >
                                                {cellText(entry, col.key)}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </TouchableOpacity>

                            {openRank === entry.rank && (
                                <View className="px-3 pb-3">
                                    <Breakdown entry={entry} weights={breakdownWeights} />
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </GradientCard>
    );
};
