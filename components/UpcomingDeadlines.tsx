import React from 'react';
import { View, Text } from 'react-native';
import { GradientCard } from './ui/GradientCard';
import { PlannerRow, getDeadlineStatus, DeadlineStatus } from '../services/plannerService';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

interface DeadlineEntry {
    plannerName: string;
    detail: string;
    phase: string;
    date: string;
    status: DeadlineStatus;
}

const STATUS_COLORS: Record<DeadlineStatus, { dot: string; text: string; chipBg: string; chipBorder: string }> = {
    green: { dot: '#22c55e', text: '#16a34a', chipBg: 'rgba(34, 197, 94, 0.1)', chipBorder: 'rgba(34, 197, 94, 0.35)' },
    orange: { dot: '#f59e0b', text: '#B45309', chipBg: 'rgba(245, 158, 11, 0.1)', chipBorder: 'rgba(245, 158, 11, 0.35)' },
    red: { dot: '#ef4444', text: '#dc2626', chipBg: 'rgba(239, 68, 68, 0.1)', chipBorder: 'rgba(239, 68, 68, 0.35)' },
    na: { dot: '#A8A29E', text: '#A8A29E', chipBg: 'rgba(120, 113, 108, 0.1)', chipBorder: 'rgba(120, 113, 108, 0.35)' },
};

const getRelativeDays = (date: string, currentDate: Date): { text: string; overdue: boolean } => {
    const target = new Date(date.slice(0, 10) + 'T00:00:00');
    const diffDays = Math.round((target.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d ago`, overdue: true };
    if (diffDays === 0) return { text: 'Today', overdue: false };
    if (diffDays === 1) return { text: 'Tomorrow', overdue: false };
    return { text: `in ${diffDays}d`, overdue: false };
};

interface UpcomingDeadlinesProps {
    data: PlannerRow[];
    currentDate: Date;
    limit?: number;
}

export const UpcomingDeadlines = ({ data, currentDate, limit = 5 }: UpcomingDeadlinesProps) => {
    const { colors, isDark } = useTheme();

    const entries: DeadlineEntry[] = data.flatMap(row => [
        { plannerName: row.plannerName, detail: `${row.class} · ${row.country}`, phase: 'Option', date: row.optionPlanDate, status: getDeadlineStatus(row.optionPlanDate, currentDate) },
        { plannerName: row.plannerName, detail: `${row.class} · ${row.country}`, phase: 'Line', date: row.linePlanDate, status: getDeadlineStatus(row.linePlanDate, currentDate) },
        { plannerName: row.plannerName, detail: `${row.class} · ${row.country}`, phase: 'Buy', date: row.buyPlanDate, status: getDeadlineStatus(row.buyPlanDate, currentDate) },
    ])
        .filter(e => e.date)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, limit);

    return (
        <View className="mb-6">
            <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                Upcoming Deadlines
            </Text>
            <GradientCard className="p-3">
                {entries.length === 0 && (
                    <Text className="text-stone-400 dark:text-stone-500 text-xs text-center py-4">
                        No deadlines for selected filters
                    </Text>
                )}
                {entries.map((entry, index) => {
                    const sc = STATUS_COLORS[entry.status];
                    const rel = getRelativeDays(entry.date, currentDate);
                    const formatted = new Date(entry.date.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return (
                        <View
                            key={`${entry.plannerName}-${entry.phase}-${index}`}
                            className={clsx(
                                "flex-row items-center py-2.5",
                                index < entries.length - 1 && "border-b border-stone-200/60 dark:border-stone-700/60"
                            )}
                        >
                            <View
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: sc.dot,
                                    marginRight: 10,
                                    shadowColor: sc.dot,
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.6,
                                    shadowRadius: 3,
                                    elevation: 3,
                                }}
                            />
                            <View className="flex-1">
                                <View className="flex-row items-center mb-0.5">
                                    <Text className="text-stone-900 dark:text-stone-100 text-xs font-sans-bold mr-2" numberOfLines={1}>
                                        {entry.plannerName}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: sc.chipBg,
                                            borderColor: sc.chipBorder,
                                            borderWidth: 1,
                                            borderRadius: 6,
                                            paddingHorizontal: 5,
                                            paddingVertical: 1,
                                        }}
                                    >
                                        <Text style={{ color: entry.status === 'orange' && isDark ? '#FBBF24' : sc.text, fontSize: 8, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {entry.phase}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-stone-400 dark:text-stone-500 text-[10px] font-sans-medium">
                                    {entry.detail} · {formatted}
                                </Text>
                            </View>
                            <Text style={{ color: rel.overdue ? '#dc2626' : colors.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold' }}>
                                {rel.text}
                            </Text>
                        </View>
                    );
                })}
            </GradientCard>
        </View>
    );
};
