import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { fetchAssortmentData, AssortmentItem } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

const ItemCard = ({ item, onPress }: { item: AssortmentItem, onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-white dark:bg-slate-800 mb-3 rounded-xl p-3 flex-row border border-slate-200 dark:border-slate-700"
    >
        <Image
            source={{ uri: item.imageUrl }}
            className="w-20 h-24 rounded-lg bg-slate-100 dark:bg-slate-700"
            resizeMode="cover"
        />
        <View className="flex-1 ml-3 justify-between py-1">
            <View>
                <View className="flex-row justify-between items-start">
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-base flex-1 mr-2" numberOfLines={2}>{item.name}</Text>
                    <View className={clsx("px-2 py-1 rounded text-[10px]", item.status === 'Assorted' ? "bg-green-100 dark:bg-green-900/40" : "bg-slate-200 dark:bg-slate-700")}>
                        <Text className={clsx("text-[10px] font-bold", item.status === 'Assorted' ? "text-green-700 dark:text-green-400" : "text-slate-500 dark:text-slate-400")}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">{item.className} • {item.country}</Text>
            </View>

            <View className="flex-row justify-between items-end">
                <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg">${item.sellingPrice.toFixed(0)}</Text>
                <Ionicons name="chevron-forward" color="#64748b" size={16} />
            </View>
        </View>
    </TouchableOpacity>
);

export default function ItemList() {
    const [data, setData] = useState<AssortmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const { colors, isDark } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await fetchAssortmentData();
            setData(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesClass = filterClass === 'All' || item.className === filterClass;
            return matchesSearch && matchesClass;
        });
    }, [data, search, filterClass]);

    // Specific Logic for "Assorted vs Suggested"
    // Assuming 'Planned Units' represents suggestion target for this demo, or we mock it.
    const assortedCount = filteredData.filter(i => i.status === 'Assorted').length;
    const totalCount = filteredData.length;
    // Mock suggestion target as +20% of current list for demo visuals
    const suggestedCount = Math.floor(totalCount * 1.2) || 10;

    const classes = ['All', ...new Set(data.map(d => d.className))];

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen options={{
                title: "Assortment Items",
                headerShown: true,
                headerStyle: { backgroundColor: isDark ? '#020617' : '#f8fafc' },
                headerTintColor: colors.textPrimary,
                headerBackVisible: false
            }} />

            <View className="p-4 border-b border-slate-200 dark:border-slate-800">
                {/* Search */}
                <View className="bg-white dark:bg-slate-800 rounded-lg flex-row items-center px-3 h-10 mb-4 border border-slate-200 dark:border-slate-700">
                    <Ionicons name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        className="flex-1 ml-2 text-slate-900 dark:text-slate-100"
                        placeholder="Search items..."
                        placeholderTextColor="#94a3b8"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Summary Header */}
                <View className="flex-row justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <View className="items-center flex-1 border-r border-slate-200 dark:border-slate-700">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Assorted</Text>
                        <Text className="text-slate-900 dark:text-slate-100 text-2xl font-bold">{assortedCount}</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Suggested</Text>
                        <Text className="text-slate-900 dark:text-slate-100 text-2xl font-bold">{suggestedCount}</Text>
                    </View>
                </View>

                {/* Class Filters */}
                <FlatList
                    horizontal
                    data={classes}
                    className="mt-4"
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setFilterClass(item)}
                            className={clsx(
                                "px-4 py-2 rounded-full mr-2 border",
                                filterClass === item ? "bg-accent border-accent" : "bg-transparent border-slate-300 dark:border-slate-600"
                            )}
                        >
                            <Text className={clsx("font-medium", filterClass === item ? "text-slate-900 dark:text-slate-900" : "text-slate-600 dark:text-slate-300")}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <ItemCard
                        item={item}
                        onPress={() => router.push(`/items/${item.id}`)}
                    />
                )}
            />
        </View>
    );
}
