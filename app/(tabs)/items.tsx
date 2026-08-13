import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssortmentItem } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';

import { ItemCard, ItemGrid } from '../../components/ItemCard';
import { ItemDetailModal } from '../../components/ItemDetailModal';
import { AttributeDistribution } from '../../components/AttributeDistribution';
import { AppHeader } from '../../components/AppHeader';
import { FilterBar } from '../../components/FilterBar';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton, SkeletonItemCard } from '../../components/Skeleton';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import { useTheme } from '../../context/ThemeContext';
import { ScrollToTopFAB } from '../../components/ScrollToTopFAB';

const CollapsibleSection = ({ title, children, defaultExpanded = true }: { title: string, children: React.ReactNode, defaultExpanded?: boolean }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const { colors } = useTheme();

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="flex-row items-center justify-between py-2"
            >
                <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200">{title}</Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {expanded && children}
        </View>
    );
};

export default function ItemsScreen() {
    const { data, loading, handleMultiUpload, plannerData } = useData();
    const { isDark, colors } = useTheme();

    const {
        selectedCategory, setSelectedCategory,
        selectedClass, setSelectedClass,
        selectedSeason, setSelectedSeason,
        selectedBizLocation, setSelectedBizLocation,
        selectedCountry, setSelectedCountry,
        resetFilters,
    } = useFilters();

    const [selectedItem, setSelectedItem] = useState<AssortmentItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setShowScrollTop(e.nativeEvent.contentOffset.y > 300);
    }, []);

    const scrollToTop = useCallback(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []);

    const categoryToClasses = useMemo(() => {
        const map: Record<string, Set<string>> = {};
        plannerData.forEach(r => {
            if (!map[r.category]) map[r.category] = new Set();
            map[r.category].add(r.class);
        });
        data.forEach(item => {
            if (item.category && item.className) {
                if (!map[item.category]) map[item.category] = new Set();
                map[item.category].add(item.className);
            }
        });
        return map;
    }, [plannerData, data]);

    const bizLocationToCountries = useMemo(() => {
        const map: Record<string, Set<string>> = {};
        plannerData.forEach(r => {
            if (!map[r.businessLocation]) map[r.businessLocation] = new Set();
            map[r.businessLocation].add(r.country);
        });
        data.forEach(item => {
            if (item.businessLocation && item.country) {
                if (!map[item.businessLocation]) map[item.businessLocation] = new Set();
                map[item.businessLocation].add(item.country);
            }
        });
        return map;
    }, [plannerData, data]);

    const categories = useMemo(() => ['All', ...Object.keys(categoryToClasses)], [categoryToClasses]);
    const classes = useMemo(() => {
        if (selectedCategory === 'All') return ['All', ...new Set(data.map(d => d.className))];
        const allowed = categoryToClasses[selectedCategory];
        return allowed ? ['All', ...allowed] : ['All'];
    }, [data, selectedCategory, categoryToClasses]);

    const bizLocations = useMemo(() => ['All', ...Object.keys(bizLocationToCountries)], [bizLocationToCountries]);
    const countries = useMemo(() => {
        if (selectedBizLocation === 'All') return ['All', ...new Set(data.map(d => d.country))];
        const allowed = bizLocationToCountries[selectedBizLocation];
        return allowed ? ['All', ...allowed] : ['All'];
    }, [data, selectedBizLocation, bizLocationToCountries]);

    const seasons = useMemo(() => ['All', ...new Set(data.map(d => d.season))], [data]);

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
        setSelectedClass('All');
    };

    const handleBizLocationChange = (val: string) => {
        setSelectedBizLocation(val);
        setSelectedCountry('All');
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            const matchesClass = selectedClass === 'All' || item.className === selectedClass;
            const matchesCountry = selectedCountry === 'All' || item.country === selectedCountry;
            const matchesBizLocation = selectedBizLocation === 'All' || item.businessLocation === selectedBizLocation;
            const matchesSeason = selectedSeason === 'All' || item.season === selectedSeason;
            return matchesCategory && matchesClass && matchesCountry && matchesBizLocation && matchesSeason;
        });
    }, [data, selectedCategory, selectedClass, selectedCountry, selectedBizLocation, selectedSeason]);

    const approvedCount = filteredData.filter(i => i.status === 'Approved').length;
    const underReviewCount = filteredData.filter(i => i.status === 'Under Review').length;
    const totalCount = approvedCount + underReviewCount;
    const suggestedCount = filteredData.reduce((sum, item) => sum + (item.suggested || 0), 0);

    const handleItemPress = (item: AssortmentItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const attributeData = useMemo(() => {
        const approvedItems = filteredData.filter(i => i.status === 'Approved');

        const calculateTop3 = (attrName: keyof AssortmentItem) => {
            const counts: { [key: string]: number } = {};
            approvedItems.forEach(item => {
                const value = item[attrName] as string;
                if (value) counts[value] = (counts[value] || 0) + 1;
            });
            return Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, count]) => ({
                    name,
                    percent: Math.round((count / approvedItems.length) * 100) || 0
                }));
        };

        return {
            material: calculateTop3('material'),
            fit: calculateTop3('fit'),
            color: calculateTop3('color'),
        };
    }, [filteredData]);

    return (
        <View className="flex-1 bg-stone-50 dark:bg-stone-900">
            <SafeAreaView edges={['top']} className="flex-1">

        <ScrollView ref={scrollRef} className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.accent}
                            colors={[colors.accent]}
                            progressBackgroundColor={colors.refreshBg}
                        />
                    }
                >
                    <AppHeader onUpload={handleMultiUpload} />
                    <FilterBar
                        categories={categories} selectedCategory={selectedCategory} setSelectedCategory={handleCategoryChange}
                        classes={classes} selectedClass={selectedClass} setSelectedClass={setSelectedClass}
                        seasons={seasons} selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
                        bizLocations={bizLocations} selectedBizLocation={selectedBizLocation} setSelectedBizLocation={handleBizLocationChange}
                        countries={countries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                    />
                    <View className="w-full">
                        {loading ? (
                            <View className="px-4 mt-4">
                                <Skeleton height={96} radius={12} style={{ marginBottom: 16 }} />
                                <Skeleton height={96} radius={12} style={{ marginBottom: 20 }} />
                                <View className="flex-row flex-wrap justify-between">
                                    {[...Array(6)].map((_, i) => (
                                        <SkeletonItemCard key={i} />
                                    ))}
                                </View>
                            </View>
                        ) : data.length === 0 ? (
                            <EmptyState
                                icon="cloud-upload-outline"
                                title="No data yet"
                                message="Load the demo dataset or upload your own CSV files to explore the assortment."
                                actionLabel="Load Demo Data"
                                onAction={() => handleMultiUpload([{ name: '__RESET__', text: '__RESET__' }])}
                            />
                        ) : filteredData.length === 0 ? (
                            <EmptyState
                                icon="filter-outline"
                                title="No items match your filters"
                                message="Try adjusting or clearing the active filters to see more items."
                                actionLabel="Clear Filters"
                                onAction={resetFilters}
                            />
                        ) : (
                            <>
                                <View className="px-4 mt-4">

                                    <CollapsibleSection title="Options Count">
                                        <View className="flex-row justify-between bg-white dark:bg-stone-800 p-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
                                            <View className="items-center flex-1 border-r border-stone-200 dark:border-stone-700/50">
                                                <Text className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-sans-bold mb-1">Approved</Text>
                                                <Text className="text-green-700 dark:text-green-400 text-3xl font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>{approvedCount}</Text>
                                            </View>
                                            <View className="items-center flex-1 border-r border-stone-200 dark:border-stone-700/50">
                                                <Text className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-sans-bold mb-1">Under Review</Text>
                                                <Text className="text-amber-700 dark:text-amber-400 text-3xl font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>{underReviewCount}</Text>
                                            </View>
                                            <View className="items-center flex-1">
                                                <Text className="text-stone-500 dark:text-stone-400 text-[10px] uppercase font-sans-bold mb-1">Suggested</Text>
                                                <Text className="text-amber-700 dark:text-amber-400 text-3xl font-sans-bold" style={{ fontVariant: ['tabular-nums'] }}>{suggestedCount || 0}</Text>
                                            </View>
                                        </View>
                                    </CollapsibleSection>

                                    <AttributeDistribution data={attributeData} />
                                </View>

                                <ItemGrid items={filteredData} onItemPress={handleItemPress} />
                            </>
                        )}

                        <View className="h-20" />
                    </View>
                </ScrollView>

                <ScrollToTopFAB visible={showScrollTop} onPress={scrollToTop} />

                <ItemDetailModal
                    visible={modalVisible}
                    item={selectedItem}
                    onClose={() => setModalVisible(false)}
                />
            </SafeAreaView>
        </View>
    );
}
