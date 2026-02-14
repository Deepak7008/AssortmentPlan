import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlannerRow, getDeadlineStatus, DeadlineStatus } from '../services/plannerService';

const STATUS_COLORS: Record<DeadlineStatus, { bg: string; border: string; text: string }> = {
    green: { bg: '#22c55e20', border: '#22c55e', text: '#4ade80' },
    orange: { bg: '#f59e0b20', border: '#f59e0b', text: '#fbbf24' },
    red: { bg: '#ef444420', border: '#ef4444', text: '#f87171' },
};

const DeadlineCell = ({ date, currentDate }: { date: string; currentDate: Date }) => {
    const status = getDeadlineStatus(date, currentDate);
    const colors = STATUS_COLORS[status];
    const formatted = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <View style={{ width: 80, alignItems: 'center' }}>
            <View style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: colors.border,
                marginBottom: 4,
                shadowColor: colors.border,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 4,
                elevation: 4,
            }} />
            <Text style={{ color: colors.text, fontSize: 10, fontWeight: '600' }}>{formatted}</Text>
        </View>
    );
};

const ProgressBarMini = ({ value }: { value: number }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    return (
        <View style={{ width: 80, alignItems: 'center' }}>
            <View style={{
                width: '100%',
                height: 6,
                backgroundColor: '#1e293b',
                borderRadius: 3,
                overflow: 'hidden',
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.05)',
            }}>
                <LinearGradient
                    colors={['#0ea5e9', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: `${clampedValue}%`, height: '100%', borderRadius: 3 }}
                />
            </View>
            <Text style={{ color: '#e2e8f0', fontSize: 10, fontWeight: '700', marginTop: 3 }}>
                {clampedValue}%
            </Text>
        </View>
    );
};

interface PlannerProgressTableProps {
    data: PlannerRow[];
    currentDate: Date;
    onRowPress?: (row: PlannerRow) => void;
}

export const PlannerProgressTable = ({ data, currentDate, onRowPress }: PlannerProgressTableProps) => {
    const headerStyle = {
        color: '#94a3b8',
        fontSize: 9 as number,
        fontWeight: '700' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
    };

    return (
        <View style={{
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
        }}>
            <LinearGradient
                colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.98)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                        <LinearGradient
                            colors={['rgba(56, 189, 248, 0.08)', 'rgba(168, 85, 247, 0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flexDirection: 'row',
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(255,255,255,0.06)',
                            }}
                        >
                            <View style={{ width: 90 }}>
                                <Text style={headerStyle}>Name</Text>
                            </View>
                            <View style={{ width: 100 }}>
                                <Text style={headerStyle}>Filter</Text>
                            </View>
                            <View style={{ width: 80, alignItems: 'center' }}>
                                <Text style={headerStyle}>Progress</Text>
                            </View>
                            <View style={{ width: 80, alignItems: 'center' }}>
                                <Text style={headerStyle}>Option Plan</Text>
                            </View>
                            <View style={{ width: 80, alignItems: 'center' }}>
                                <Text style={headerStyle}>Line Plan</Text>
                            </View>
                            <View style={{ width: 80, alignItems: 'center' }}>
                                <Text style={headerStyle}>Buy Plan</Text>
                            </View>
                        </LinearGradient>

                        {data.map((row, index) => {
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
                                        backgroundColor: isEven ? 'rgba(30, 41, 59, 0.3)' : 'transparent',
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'rgba(255,255,255,0.03)',
                                    }}
                                >
                                    <View style={{ width: 90 }}>
                                        <Text style={{ color: '#f1f5f9', fontSize: 12, fontWeight: '600' }}>
                                            {shortName}
                                        </Text>
                                    </View>
                                    <View style={{ width: 100 }}>
                                        <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '500' }}>
                                            {row.class}, {row.country}
                                        </Text>
                                    </View>
                                    <ProgressBarMini value={row.progress} />
                                    <DeadlineCell date={row.optionPlanDate} currentDate={currentDate} />
                                    <DeadlineCell date={row.linePlanDate} currentDate={currentDate} />
                                    <DeadlineCell date={row.buyPlanDate} currentDate={currentDate} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};
