import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssortmentItem } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';

import { ItemCard, ItemGrid } from '../../components/ItemCard';
import { ItemDetailModal } from '../../components/ItemDetailModal';
import { AttributeDistribution } from '../../components/AttributeDistribution';
import { AppHeader } from '../../components/AppHeader';
import { FilterBar } from '../../components/FilterBar';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';

const CollapsibleSection = ({ title, children, defaultExpanded = true }: { title: string, children: React.ReactNode, defaultExpanded?: boolean }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="flex-row items-center justify-between py-2"
            >
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color="#94a3b8" />
            </TouchableOpacity>
            {expanded && children}
        </View>
    );
};

export default function ItemsScreen() {
    const { data, loading, handleMultiUpload, plannerData } = useData();

    const {
        selectedCategory, setSelectedCategory,
        selectedClass, setSelectedClass,
        selectedSeason, setSelectedSeason,
        selectedBizLocation, setSelectedBizLocation,
        selectedCountry, setSelectedCountry,
    } = useFilters();

    const [selectedItem, setSelectedItem] = useState<AssortmentItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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
        <View className="flex-1 bg-slate-950">
            <SafeAreaView edges={['top']} className="flex-1">
                <AppHeader onUpload={handleMultiUpload} />

                <FilterBar
                    categories={categories} selectedCategory={selectedCategory} setSelectedCategory={handleCategoryChange}
                    classes={classes} selectedClass={selectedClass} setSelectedClass={setSelectedClass}
                    seasons={seasons} selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
                    bizLocations={bizLocations} selectedBizLocation={selectedBizLocation} setSelectedBizLocation={handleBizLocationChange}
                    countries={countries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="w-full md:max-w-7xl md:self-center">
                        <View className="px-4 mt-4">

                            <CollapsibleSection title="Options Count">
                                <View className="flex-row justify-between bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-700">
                                    <View className="items-center flex-1 border-r border-slate-700/50">
                                        <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Approved</Text>
                                        <Text className="text-green-400 text-3xl font-bold">{approvedCount}</Text>
                                    </View>
                                    <View className="items-center flex-1 border-r border-slate-700/50">
                                        <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Under Review</Text>
                                        <Text className="text-yellow-400 text-3xl font-bold">{underReviewCount}</Text>
                                    </View>
                                    <View className="items-center flex-1">
                                        <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Suggested</Text>
                                        <Text className="text-sky-400 text-3xl font-bold">{suggestedCount || 0}</Text>
                                    </View>
                                </View>
                            </CollapsibleSection>

                            <AttributeDistribution data={attributeData} />
                        </View>

                        <ItemGrid items={filteredData} onItemPress={handleItemPress} />

                        <View className="h-20" />
                    </View>
                </ScrollView>

                <ItemDetailModal
                    visible={modalVisible}
                    item={selectedItem}
                    onClose={() => setModalVisible(false)}
                />
            </SafeAreaView>
        </View>
    );
}
