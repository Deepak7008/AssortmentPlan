import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlannerRow, getDeadlineStatus, DeadlineStatus } from '../services/plannerService';
import { useTheme } from '../context/ThemeContext';

const STATUS_COLORS: Record<DeadlineStatus, { bg: string; border: string; text: string; label: string }> = {
    green: { bg: '#22c55e20', border: '#22c55e', text: '#16a34a', label: 'On Track' },
    orange: { bg: '#f59e0b20', border: '#f59e0b', text: '#d97706', label: 'Due Soon' },
    red: { bg: '#ef444420', border: '#ef4444', text: '#dc2626', label: 'Overdue' },
    na: { bg: 'transparent', border: '#64748b', text: '#64748b', label: 'No Date' },
};

const RISK_ORDER: Record<DeadlineStatus, number> = { red: 0, orange: 1, green: 2, na: 3 };

interface RowRisk {
    worst: DeadlineStatus;
    nearestDate: string;
}

const getRowRisk = (row: PlannerRow, currentDate: Date): RowRisk => {
    const dates = [
        { date: row.optionPlanDate, label: 'Option' },
        { date: row.linePlanDate, label: 'Line' },
        { date: row.buyPlanDate, label: 'Buy' },
    ].filter(d => d.date);

    if (dates.length === 0) return { worst: 'na', nearestDate: '' };

    let worst: DeadlineStatus = 'green';
    let nearestDate = '';

    dates.forEach(d => {
        const status = getDeadlineStatus(d.date, currentDate);
        if (RISK_ORDER[status] < RISK_ORDER[worst]) worst = status;
        const dateOnly = d.date.slice(0, 10);
        if (!nearestDate || dateOnly < nearestDate) nearestDate = dateOnly;
    });

    return { worst, nearestDate };
};

const ProgressBarMini = ({ value }: { value: number }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    return (
        <View className="flex-1 mr-3">
            <View className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <LinearGradient
                    colors={['#0ea5e9', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: `${clampedValue}%`, height: '100%', borderRadius: 3 }}
                />
            </View>
            <Text className="text-slate-900 dark:text-slate-100 text-[10px] font-bold mt-1">
                {clampedValue}%
            </Text>
        </View>
    );
};

const StatusCell = ({ row, currentDate }: { row: PlannerRow; currentDate: Date }) => {
    const { worst, nearestDate } = getRowRisk(row, currentDate);
    const sc = STATUS_COLORS[worst];
    const formatted = nearestDate
        ? new Date(nearestDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '';

    return (
        <View className="flex-1 items-end">
            <View className="flex-row items-center justify-end mb-1">
                <View
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: sc.border,
                        marginRight: 5,
                        shadowColor: sc.border,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 3,
                        elevation: 3,
                    }}
                />
                <Text style={{ color: sc.text, fontSize: 11, fontWeight: '700' }}>{sc.label}</Text>
            </View>
            {formatted !== '' && (
                <Text className="text-slate-400 dark:text-slate-500 text-[9px] font-medium">
                    {formatted}
                </Text>
            )}
        </View>
    );
};

interface PlannerProgressTableProps {
    data: PlannerRow[];
    currentDate: Date;
    onRowPress?: (row: PlannerRow) => void;
}

export const PlannerProgressTable = ({ data, currentDate, onRowPress }: PlannerProgressTableProps) => {
    const { colors, isDark } = useTheme();
    const headerStyle = {
        color: colors.textSecondary,
        fontSize: 9 as number,
        fontWeight: '700' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
    };

    const sorted = [...data].sort((a, b) => {
        const riskDiff = RISK_ORDER[getRowRisk(a, currentDate).worst] - RISK_ORDER[getRowRisk(b, currentDate).worst];
        if (riskDiff !== 0) return riskDiff;
        return getRowRisk(a, currentDate).nearestDate.localeCompare(getRowRisk(b, currentDate).nearestDate);
    });

    return (
        <View style={{
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        }}>
            <LinearGradient
                colors={isDark ? ['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.9)'] : ['rgba(255, 255, 255, 0.98)', 'rgba(241, 245, 249, 0.96)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <LinearGradient
                    colors={['rgba(14, 165, 233, 0.06)', 'rgba(168, 85, 247, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        flexDirection: 'row',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View style={{ width: 90 }}>
                        <Text style={headerStyle}>Name</Text>
                    </View>
                    <View style={{ width: 100 }}>
                        <Text style={headerStyle}>Filter</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={headerStyle}>Progress</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={headerStyle}>Status</Text>
                    </View>
                </LinearGradient>

                {sorted.map((row, index) => {
                    const isEven = index % 2 === 0;
                    const shortName = row.plannerName.split(' ').map((n, i) =>
                        i === 0 ? n : n[0] + '.'
                    ).join(' ');

                    return (
                        <TouchableOpacity
                            key={`${row.plannerName}-${row.class}-${index}`}
                            activeOpacity={0.6}
                            onPress={() => onRowPress?.(row)}
                            style={{
                                flexDirection: 'row',
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                alignItems: 'center',
                                backgroundColor: isEven ? 'rgba(148, 163, 184, 0.12)' : 'transparent',
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                            }}
                        >
                            <View style={{ width: 90 }}>
                                <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>
                                    {shortName}
                                </Text>
                            </View>
                            <View style={{ width: 100 }}>
                                <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '500' }} numberOfLines={1}>
                                    {row.class}, {row.country}
                                </Text>
                            </View>
                            <ProgressBarMini value={row.progress} />
                            <StatusCell row={row} currentDate={currentDate} />
                        </TouchableOpacity>
                    );
                })}

                {sorted.length === 0 && (
                    <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center', paddingVertical: 24 }}>
                        No assignments for selected filters
                    </Text>
                )}
            </LinearGradient>
        </View>
    );
};
