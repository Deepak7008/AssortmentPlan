import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientCard } from './ui/GradientCard';
import { useTheme } from '../context/ThemeContext';

interface HeatmapCell {
    region: string;
    className: string;
    sales: number;
}

interface RegionalHeatmapProps {
    data: HeatmapCell[];
}

// ── Color interpolation helpers ──────────────────────────────────────────

type RGB = [number, number, number];

const COLOR_STOPS: { stop: number; color: RGB }[] = [
    { stop: 0.0, color: [30, 64, 175] },   // #1e40af — deep blue  (low)
    { stop: 0.35, color: [14, 165, 233] },  // #0ea5e9 — sky blue   (low-mid)
    { stop: 0.55, color: [245, 158, 11] },  // #f59e0b — amber      (mid)
    { stop: 0.8, color: [239, 68, 68] },    // #ef4444 — red        (high)
    { stop: 1.0, color: [185, 28, 28] },    // #b91c1c — deep red   (max)
];

const lerpRGB = (a: RGB, b: RGB, t: number): RGB => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
];

const getHeatColor = (ratio: number): string => {
    const clamped = Math.min(1, Math.max(0, ratio));
    for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
        const curr = COLOR_STOPS[i];
        const next = COLOR_STOPS[i + 1];
        if (clamped >= curr.stop && clamped <= next.stop) {
            const t = (clamped - curr.stop) / (next.stop - curr.stop);
            const [r, g, b] = lerpRGB(curr.color, next.color, t);
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    const last = COLOR_STOPS[COLOR_STOPS.length - 1].color;
    return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
};

// ── Tooltip component ────────────────────────────────────────────────────

interface TooltipInfo {
    className: string;
    region: string;
    sales: number;
}

const CellTooltip = ({ info, onDismiss }: { info: TooltipInfo; onDismiss: () => void }) => (
    <Pressable
        onPress={onDismiss}
        style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 20,
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <View style={{
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(56, 189, 248, 0.3)',
            shadowColor: '#0ea5e9',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
            alignItems: 'center',
            maxWidth: 200,
        }}>
            <Text style={{ color: '#e2e8f0', fontSize: 12, fontWeight: '700', marginBottom: 2 }}>
                {info.className} × {info.region}
            </Text>
            <Text style={{ color: '#38bdf8', fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
                ${(info.sales / 1000).toFixed(1)}k
            </Text>
        </View>
    </Pressable>
);

// ── Legend component ─────────────────────────────────────────────────────

const ColorLegend = () => {
    const { colors } = useTheme();
    return (
        <View style={{ marginTop: 12, paddingHorizontal: 4 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
            }}>
                <Text style={{ color: colors.textSecondary, fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Low
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Sales Volume
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                    High
                </Text>
            </View>
            <LinearGradient
                colors={['#1e40af', '#0ea5e9', '#f59e0b', '#ef4444', '#b91c1c']}
                locations={[0, 0.35, 0.55, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    height: 8,
                    borderRadius: 4,
                    overflow: 'hidden',
                }}
            />
        </View>
    );
};

// ── Main component ───────────────────────────────────────────────────────

const CELL_WIDTH = 68;
const CELL_HEIGHT = 44;
const CELL_GAP = 3;
const LABEL_WIDTH = 84;

export const RegionalHeatmap = ({ data }: RegionalHeatmapProps) => {
    const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
    const [gridWidth, setGridWidth] = useState(0);
    const { colors, isDark } = useTheme();

    const regions = [...new Set(data.map(d => d.region))];
    const classes = [...new Set(data.map(d => d.className))];
    const maxSales = Math.max(...data.map(d => d.sales), 1);

    const cellWidth = regions.length > 0
        ? Math.max(CELL_WIDTH, Math.floor((gridWidth - LABEL_WIDTH - CELL_GAP * regions.length) / regions.length))
        : CELL_WIDTH;

    const getCellData = (region: string, className: string) => {
        const cell = data.find(d => d.region === region && d.className === className);
        return cell ? cell.sales : 0;
    };

    const handleCellPress = (className: string, region: string, sales: number) => {
        if (tooltip && tooltip.className === className && tooltip.region === region) {
            setTooltip(null);
        } else {
            setTooltip({ className, region, sales });
        }
    };

    return (
        <View className="mb-6">
            <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 pl-1">
                Regional Heatmap
            </Text>
            <GradientCard className="p-3" onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
                <View style={{ position: 'relative' }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            {/* Column headers (regions) */}
                            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                                <View style={{ width: LABEL_WIDTH }} />
                                {regions.map(region => (
                                    <View
                                        key={region}
                                        style={{ width: cellWidth + CELL_GAP, alignItems: 'center' }}
                                    >
                                        <Text style={{
                                            color: colors.textSecondary,
                                            fontSize: 10,
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}>
                                            {region}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Data rows */}
                            {classes.map(cls => (
                                <View key={cls} style={{ flexDirection: 'row', marginBottom: CELL_GAP }}>
                                    <View style={{ width: LABEL_WIDTH, justifyContent: 'center', paddingRight: 4 }}>
                                        <Text
                                            style={{ color: colors.textPrimary, fontSize: 11, fontWeight: '600' }}
                                            numberOfLines={1}
                                        >
                                            {cls}
                                        </Text>
                                    </View>
                                    {regions.map(region => {
                                        const sales = getCellData(region, cls);
                                        const ratio = sales / maxSales;
                                        const isZero = sales === 0;
                                        const bgColor = isZero
                                            ? (isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)')
                                            : getHeatColor(ratio);
                                        const isActive = tooltip?.className === cls && tooltip?.region === region;

                                        return (
                                            <TouchableOpacity
                                                key={region}
                                                activeOpacity={0.7}
                                                onPress={() => handleCellPress(cls, region, sales)}
                                                style={{
                                                    width: cellWidth,
                                                    height: CELL_HEIGHT,
                                                    marginHorizontal: CELL_GAP / 2,
                                                    borderRadius: 10,
                                                    backgroundColor: bgColor,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: isActive ? 2 : 1,
                                                    borderColor: isActive
                                                        ? 'rgba(2, 132, 199, 0.6)'
                                                        : 'rgba(15, 23, 42, 0.08)',
                                                    shadowColor: isZero ? 'transparent' : bgColor,
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.4,
                                                    shadowRadius: 6,
                                                    elevation: isZero ? 0 : 4,
                                                }}
                                            >
                                                <Text style={{
                                                    color: isZero ? '#94a3b8' : '#ffffff',
                                                    fontSize: 11,
                                                    fontWeight: '700',
                                                    fontVariant: ['tabular-nums'],
                                                    textShadowColor: isZero ? 'transparent' : 'rgba(0,0,0,0.4)',
                                                    textShadowOffset: { width: 0, height: 1 },
                                                    textShadowRadius: 2,
                                                }}>
                                                    {isZero ? '—' : `$${(sales / 1000).toFixed(0)}k`}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Tooltip overlay */}
                    {tooltip && (
                        <CellTooltip info={tooltip} onDismiss={() => setTooltip(null)} />
                    )}
                </View>

                {/* Color scale legend */}
                <ColorLegend />
            </GradientCard>
        </View>
    );
};
