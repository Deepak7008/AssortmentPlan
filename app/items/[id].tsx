import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { fetchAssortmentData, AssortmentItem } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

const MetricBox = ({ label, value, subValue, isGood = true }: any) => (
    <View className="bg-white dark:bg-slate-800 p-4 rounded-xl flex-1 m-1 border border-slate-200 dark:border-slate-700 min-w-[45%]">
        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1 uppercase font-bold">{label}</Text>
        <Text className="text-slate-900 dark:text-slate-100 text-xl font-bold">{value}</Text>
        {subValue && (
            <Text className={clsx("text-xs mt-1 font-bold", isGood ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                {subValue}
            </Text>
        )}
    </View>
);

export default function ItemDetail() {
    const { id } = useLocalSearchParams();
    const [item, setItem] = useState<AssortmentItem | null>(null);
    const router = useRouter();
    const { colors, isDark } = useTheme();

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        // In a real app we'd fetchById. Here we load all and find.
        const all = await fetchAssortmentData();
        const found = all.find(i => i.id === id);
        setItem(found || null);
    };

    if (!item) {
        return (
            <View className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
                <Text className="text-slate-500 dark:text-slate-400">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen options={{
                headerShown: false, // We'll make a custom translucent header
            }} />

            <ScrollView className="flex-1" bounces={false}>
                {/* Hero Image Section */}
                <View className="h-96 relative">
                    <Image
                        source={{ uri: item.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    {/* Overlay Gradient equivalent associated with Image */}
                    <View className="absolute inset-0 bg-black/30" />
                    <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/60">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-slate-300 text-sm font-bold tracking-widest uppercase">{item.className}</Text>
                            <View className="bg-white/20 px-2 py-1 rounded">
                                <Text className="text-white text-xs font-bold">{item.season}</Text>
                            </View>
                        </View>
                        <Text className="text-white text-3xl font-bold leading-tight mb-2">{item.name}</Text>
                        <Text className="text-slate-300 text-sm">SKU: {item.id} • {item.country}</Text>
                    </View>

                    {/* Back Button Overlay */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-12 left-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
                    >
                        <Ionicons name="arrow-back" color="white" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Content Body */}
                <View className="px-5 py-6">

                    {/* Status Section */}
                    <View className="flex-row items-center mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <View className={clsx("w-10 h-10 rounded-full items-center justify-center mr-4", item.status === 'Assorted' ? "bg-green-100 dark:bg-green-900/40" : "bg-slate-200 dark:bg-slate-700")}>
                            <Ionicons
                                name={item.status === 'Assorted' ? "checkmark" : "time"}
                                size={24}
                                color={item.status === 'Assorted' ? "#16a34a" : colors.textSecondary}
                            />
                        </View>
                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Assortment Status</Text>
                            <Text className={clsx("text-lg font-bold", item.status === 'Assorted' ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-slate-100")}>
                                {item.status} ({item.lifecycle})
                            </Text>
                        </View>
                    </View>

                    {/* Metrics Grid */}
                    <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4">Economics</Text>
                    <View className="flex-row flex-wrap justify-between -m-1">
                        <MetricBox
                            label="Selling Price"
                            value={`$${item.sellingPrice.toFixed(2)}`}
                        />
                        <MetricBox
                            label="Cost"
                            value={`$${item.cost.toFixed(2)}`}
                            isGood={true}
                        />
                        <MetricBox
                            label="Margin"
                            value={`$${item.margin.toFixed(2)}`}
                            subValue={item.marginPercent}
                            isGood={item.margin > 20}
                        />
                        <MetricBox
                            label="Rate of Sale"
                            value={item.ros}
                            subValue={item.ros > 2 ? 'High Vel' : 'Slow'}
                            isGood={item.ros > 2}
                        />
                    </View>

                    {/* Store Count / Distribution */}
                    <View className="mt-6 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex-row justify-between items-center">
                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Store Count</Text>
                            <Text className="text-slate-900 dark:text-slate-100 text-2xl font-bold">{item.storeCount} Stores</Text>
                        </View>
                        <View className="h-10 w-32 bg-slate-100 dark:bg-slate-700 rounded flex-row items-end pb-1 space-x-1 justify-center">
                            {/* Mini Bar Chart Visual */}
                            <View className="w-2 h-4 bg-slate-300 dark:bg-slate-600 rounded-sm" />
                            <View className="w-2 h-6 bg-slate-400 dark:bg-slate-500 rounded-sm" />
                            <View className="w-2 h-8 bg-accent rounded-sm" />
                            <View className="w-2 h-5 bg-slate-300 dark:bg-slate-600 rounded-sm" />
                        </View>
                    </View>

                    <View className="h-20" />
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <View className="absolute bottom-8 right-6">
                <TouchableOpacity className="w-14 h-14 bg-accent rounded-full items-center justify-center shadow-lg shadow-accent/50">
                    <Ionicons name="pencil" color="#0f172a" size={24} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
