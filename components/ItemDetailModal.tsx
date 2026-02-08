import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { AssortmentItem } from '../services/dataService';
import { GradientCard } from './ui/GradientCard';
import clsx from 'clsx';
import { GlassView } from './ui/GlassView';

interface ItemDetailModalProps {
    visible: boolean;
    item: AssortmentItem | null;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const MetricBox = ({ label, value, isPrimary = false }: { label: string, value: string, isPrimary?: boolean }) => (
    <View className={clsx("p-2.5 rounded-xl flex-1 mx-0.5 border", isPrimary ? "bg-slate-700 border-sky-500/50" : "bg-slate-800 border-slate-700")}>
        <Text className="text-slate-400 text-[9px] uppercase font-bold mb-0.5">{label}</Text>
        <Text className={clsx("text-lg font-bold font-mono", isPrimary ? "text-sky-400" : "text-white")}>{value}</Text>
    </View>
);

export const ItemDetailModal = ({ visible, item, onClose }: ItemDetailModalProps) => {
    if (!item) return null;

    const salesDollar = (item.sellingPrice * item.ros * item.storeCount).toFixed(0);
    const marginDollar = (item.margin * item.ros * item.storeCount).toFixed(0);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center">
                <BlurView intensity={20} tint="dark" className="absolute inset-0" />
                <TouchableOpacity
                    className="absolute inset-0 bg-black/80"
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View
                    style={{ width: Math.min(width * 0.9, 480), maxHeight: height * 0.85 }}
                    className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
                >
                    <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        <View className="h-56 w-full relative">
                            <Image
                                source={{ uri: item.imageUrl }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                onPress={onClose}
                                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>

                            <GlassView intensity={40} className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border-none">
                                <Text className="text-white text-xl font-bold leading-6 mb-1">{item.name}</Text>
                                <Text className="text-slate-300 text-sm">{item.className} • {item.season}</Text>
                            </GlassView>
                        </View>

                        <View className="p-5">
                            {/* Status (left) + Lifecycle (right) */}
                            <View className="flex-row justify-between items-center mb-5 pb-4 border-b border-slate-800">
                                <View>
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Status</Text>
                                    <Text className={clsx("text-lg font-bold", item.status === 'Approved' ? "text-green-400" : "text-amber-400")}>
                                        {item.status}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Lifecycle</Text>
                                    <Text className="text-lg font-bold text-white">{item.lifecycle}</Text>
                                </View>
                            </View>

                            {/* Economics Section */}
                            <Text className="text-white text-sm font-bold uppercase mb-3 opacity-80">Economics</Text>

                            {/* Row 1: Selling Price, CP, ROS */}
                            <View className="flex-row mb-2">
                                <MetricBox label="Selling Price" value={`$${item.sellingPrice}`} isPrimary />
                                <MetricBox label="Cost Price" value={`$${item.cost}`} />
                                <MetricBox label="ROS" value={item.ros.toFixed(1)} />
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
