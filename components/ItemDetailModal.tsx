import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AssortmentItem } from '../services/dataService';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';

interface ItemDetailModalProps {
    visible: boolean;
    item: AssortmentItem | null;
    onClose: () => void;
}

const MetricBox = ({ label, value, isPrimary = false }: { label: string, value: string, isPrimary?: boolean }) => {
    const { colors, isDark } = useTheme();
    return (
        <View className={clsx("p-2.5 rounded-xl flex-1 mx-0.5 border", isPrimary ? "bg-sky-50 dark:bg-sky-500/15 border-sky-500/50 dark:border-sky-500/30" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700")}>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold mb-0.5">{label}</Text>
            <Text className={clsx("text-lg font-bold font-mono", isPrimary ? "text-sky-600 dark:text-sky-400" : "text-slate-900 dark:text-slate-100")}>{value}</Text>
        </View>
    );
};

export const ItemDetailModal = ({ visible, item, onClose }: ItemDetailModalProps) => {
    const { colors } = useTheme();
    if (!item) return null;

    const salesDollar = (item.sellingPrice * item.ros * item.storeCount).toFixed(0);
    const marginDollar = (item.margin * item.ros * item.storeCount).toFixed(0);

    // Safely get dimensions at render time
    const { width, height } = Dimensions.get('window');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* Dark backdrop — no BlurView, just a semi-transparent overlay */}
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    }}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View
                    style={{
                        width: Math.min(width * 0.9, 480),
                        maxHeight: height * 0.85,
                        backgroundColor: colors.surface,
                        borderRadius: 16,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: colors.border,
                    }}
                >
                    <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Hero Image */}
                        <View style={{ height: 224, width: '100%', position: 'relative' }}>
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                            {/* Close button */}
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    padding: 8,
                                    borderRadius: 20,
                                }}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>

                            {/* Item info overlay at bottom of image */}
                            <View style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                right: 16,
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.08)',
                            }}>
                                <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '700', lineHeight: 24, marginBottom: 4 }}>
                                    {item.name}
                                </Text>
                                <Text style={{ color: '#cbd5e1', fontSize: 14 }}>
                                    {item.className} • {item.season}
                                </Text>
                            </View>
                        </View>

                        <View style={{ padding: 20 }}>
                            {/* Status + Lifecycle */}
                            <View className="flex-row justify-between items-center mb-5 pb-4 border-b border-slate-200 dark:border-slate-700">
                                <View>
                                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase mb-1">Status</Text>
                                    <Text className={clsx("text-lg font-bold", item.status === 'Approved' ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400")}>
                                        {item.status}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase mb-1">Lifecycle</Text>
                                    <Text className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.lifecycle || 'N/A'}</Text>
                                </View>
                            </View>

                            {/* Economics Section */}
                            <Text className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase mb-3 opacity-80">Economics</Text>

                            {/* Row 1: Selling Price, CP, ROS */}
                            <View className="flex-row mb-2">
                                <MetricBox label="Selling Price" value={`$${item.sellingPrice}`} isPrimary />
                                <MetricBox label="Cost Price" value={`$${item.cost}`} />
                                <MetricBox label="ROS" value={item.ros?.toFixed(1) ?? '0'} />
                            </View>

                            {/* Row 2: Sales $, Margin $, Store Count */}
                            <View className="flex-row mb-4">
                                <MetricBox label="Sales $" value={`$${salesDollar}`} />
                                <MetricBox label="Margin $" value={`$${marginDollar}`} />
                                <MetricBox label="Store Count" value={`${item.storeCount}`} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
