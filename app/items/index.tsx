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
        className="bg-white dark:bg-stone-800 mb-3 rounded-xl p-3 flex-row border border-stone-200 dark:border-stone-700"
    >
        <Image
            source={{ uri: item.imageUrl }}
            className="w-20 h-24 rounded-lg bg-stone-100 dark:bg-stone-700"
            resizeMode="cover"
        />
        <View className="flex-1 ml-3 justify-between py-1">
            <View>
                <View className="flex-row justify-between items-start">
                    <Text className="text-stone-900 dark:text-stone-100 font-sans-bold text-base flex-1 mr-2" numberOfLines={2}>{item.name}</Text>
                    <View className={clsx("px-2 py-1 rounded text-[10px]", item.status === 'Assorted' ? "bg-green-100 dark:bg-green-900/40" : "bg-stone-200 dark:bg-stone-700")}>
                        <Text className={clsx("text-[10px] font-sans-bold", item.status === 'Assorted' ? "text-green-700 dark:text-green-400" : "text-stone-500 dark:text-stone-400")}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <Text className="text-stone-500 dark:text-stone-400 text-xs mt-1">{item.className} • {item.country}</Text>
            </View>

            <View className="flex-row justify-between items-end">
                <Text className="text-stone-900 dark:text-stone-100 font-sans-bold text-lg">${item.sellingPrice.toFixed(0)}</Text>
                <Ionicons name="chevron-forward" color="#A8A29E" size={16} />
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
        <View className="flex-1 bg-stone-50 dark:bg-stone-900">
            <Stack.Screen options={{
                title: "Assortment Items",
                headerShown: true,
                headerStyle: { backgroundColor: isDark ? '#020617' : '#f8fafc' },
                headerTintColor: colors.textPrimary,
                headerBackVisible: false
            }} />

            <View className="p-4 border-b border-stone-200 dark:border-stone-800">
                {/* Search */}
                <View className="bg-white dark:bg-stone-800 rounded-lg flex-row items-center px-3 h-10 mb-4 border border-stone-200 dark:border-stone-700">
                    <Ionicons name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        className="flex-1 ml-2 text-stone-900 dark:text-stone-100"
                        placeholder="Search items..."
                        placeholderTextColor="#A8A29E"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Summary Header */}
                <View className="flex-row justify-between bg-white dark:bg-stone-800 p-3 rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
                    <View className="items-center flex-1 border-r border-stone-200 dark:border-stone-700">
                        <Text className="text-stone-500 dark:text-stone-400 text-xs uppercase font-sans-bold">Assorted</Text>
                        <Text className="text-stone-900 dark:text-stone-100 text-2xl font-sans-bold">{assortedCount}</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-stone-500 dark:text-stone-400 text-xs uppercase font-sans-bold">Suggested</Text>
                        <Text className="text-stone-900 dark:text-stone-100 text-2xl font-sans-bold">{suggestedCount}</Text>
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
                                filterClass === item ? "bg-accent border-accent" : "bg-transparent border-stone-300 dark:border-stone-600"
                            )}
                        >
                            <Text className={clsx("font-sans-medium", filterClass === item ? "text-stone-900 dark:text-stone-900" : "text-stone-600 dark:text-stone-300")}>
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
