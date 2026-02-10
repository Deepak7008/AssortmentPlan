import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssortmentItem } from '../../services/dataService';
import { Ionicons } from '@expo/vector-icons';

import { GlassView } from '../../components/ui/GlassView';
import { ItemCard, ItemGrid } from '../../components/ItemCard';
import { ItemDetailModal } from '../../components/ItemDetailModal';
import { AttributeDistribution } from '../../components/AttributeDistribution';
import { UploadButton } from '../../components/UploadButton';
import { DocsButton } from '../../components/DocsButton';
import { ProfileButton } from '../../components/ProfileButton';
import { FilterBar } from '../../components/FilterBar';
import { useData } from '../../context/DataContext';

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
    const { data, loading, handleCSVUpload } = useData();

    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedSeason, setSelectedSeason] = useState('All');

    const [selectedItem, setSelectedItem] = useState<AssortmentItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const classes = useMemo(() => ['All', ...new Set(data.map(d => d.className))], [data]);
    const countries = useMemo(() => ['All', ...new Set(data.map(d => d.country))], [data]);
    const seasons = useMemo(() => ['All', ...new Set(data.map(d => d.season))], [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesClass = selectedClass === 'All' || item.className === selectedClass;
            const matchesCountry = selectedCountry === 'All' || item.country === selectedCountry;
            const matchesSeason = selectedSeason === 'All' || item.season === selectedSeason;
            return matchesClass && matchesCountry && matchesSeason;
        });
    }, [data, selectedClass, selectedCountry, selectedSeason]);

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
                <GlassView intensity={10} className="px-5 py-4 flex-row justify-between items-center border-b border-glass-border">
                    <View>
                        <Text className="text-white text-xl font-bold">Stratos</Text>
                    </View>
                    <View className="flex-row items-center">
                        <DocsButton />
                        <UploadButton onUpload={handleCSVUpload} />
                        <ProfileButton />
                    </View>
                </GlassView>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]} contentContainerStyle={{ paddingBottom: 100 }}>
                    <FilterBar
                        classes={classes} selectedClass={selectedClass} setSelectedClass={setSelectedClass}
                        countries={countries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                        seasons={seasons} selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
                    />

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
