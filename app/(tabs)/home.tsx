import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Modal, Pressable, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { GradientCard } from '../../components/ui/GradientCard';
import { FilterBar } from '../../components/FilterBar';
import { PlannerProgressTable } from '../../components/PlannerProgressTable';
import { AppHeader } from '../../components/AppHeader';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import { PlannerRow } from '../../services/plannerService';
import { ScrollToTopFAB } from '../../components/ScrollToTopFAB';

const CURRENT_DATE = new Date();


export default function HomeScreen() {
    const { plannerData, handleMultiUpload, data } = useData();
    const {
        selectedCategory, setSelectedCategory,
        selectedClass, setSelectedClass,
        selectedSeason, setSelectedSeason,
        selectedBizLocation, setSelectedBizLocation,
        selectedCountry, setSelectedCountry,
    } = useFilters();
    const router = useRouter();

    const [selectedRow, setSelectedRow] = useState<PlannerRow | null>(null);
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
        if (selectedCategory === 'All') return ['All', ...new Set(plannerData.map(r => r.class))];
        const allowed = categoryToClasses[selectedCategory];
        return allowed ? ['All', ...allowed] : ['All'];
    }, [plannerData, selectedCategory, categoryToClasses]);

    const bizLocations = useMemo(() => ['All', ...Object.keys(bizLocationToCountries)], [bizLocationToCountries]);
    const countries = useMemo(() => {
        if (selectedBizLocation === 'All') return ['All', ...new Set(plannerData.map(r => r.country))];
        const allowed = bizLocationToCountries[selectedBizLocation];
        return allowed ? ['All', ...allowed] : ['All'];
    }, [plannerData, selectedBizLocation, bizLocationToCountries]);

    const seasons = useMemo(() => ['All', ...new Set(plannerData.map(r => r.season))], [plannerData]);

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
        setSelectedClass('All');
    };

    const handleBizLocationChange = (val: string) => {
        setSelectedBizLocation(val);
        setSelectedCountry('All');
    };

    const filteredData = useMemo(() => {
        return plannerData.filter(row =>
            (selectedCategory === 'All' || row.category === selectedCategory) &&
            (selectedClass === 'All' || row.class === selectedClass) &&
            (selectedBizLocation === 'All' || row.businessLocation === selectedBizLocation) &&
            (selectedCountry === 'All' || row.country === selectedCountry) &&
            (selectedSeason === 'All' || row.season === selectedSeason)
        );
    }, [plannerData, selectedCategory, selectedClass, selectedBizLocation, selectedCountry, selectedSeason]);

    const overallProgress = useMemo(() => {
        if (filteredData.length === 0) return 0;
        return Math.round(filteredData.reduce((sum, row) => sum + row.progress, 0) / filteredData.length);
    }, [filteredData]);

    const dateStr = CURRENT_DATE.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <View className="flex-1 bg-slate-950">
            <StatusBar barStyle="light-content" />
            <SafeAreaView edges={['top']} className="flex-1">
                <AppHeader onUpload={handleMultiUpload} />

                <ScrollView
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#38bdf8"
                            colors={['#38bdf8']}
                            progressBackgroundColor="#0f172a"
                        />
                    }
                >
                    <FilterBar
                        categories={categories} selectedCategory={selectedCategory} setSelectedCategory={handleCategoryChange}
                        classes={classes} selectedClass={selectedClass} setSelectedClass={setSelectedClass}
                        seasons={seasons} selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
                        bizLocations={bizLocations} selectedBizLocation={selectedBizLocation} setSelectedBizLocation={handleBizLocationChange}
                        countries={countries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
                    />
                    <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                        <GradientCard
                            colors={['rgba(56, 189, 248, 0.12)', 'rgba(168, 85, 247, 0.08)']}
                            className="p-4 mb-5"
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                                    Overall Team Progress
                                </Text>
                                <Text style={{ color: '#f1f5f9', fontSize: 20, fontWeight: '800' }}>
                                    {overallProgress}%
                                </Text>
                            </View>
                            <View style={{
                                height: 10,
                                backgroundColor: '#1e293b',
                                borderRadius: 5,
                                overflow: 'hidden',
                                borderWidth: 0.5,
                                borderColor: 'rgba(255,255,255,0.05)',
                            }}>
                                <LinearGradient
                                    colors={['#0ea5e9', '#a855f7']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        width: `${overallProgress}%`,
                                        height: '100%',
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#64748b', fontSize: 10, marginTop: 6, textAlign: 'right' }}>
                                {filteredData.length} assignments tracked
                            </Text>
                        </GradientCard>
                    </View>

                    <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Ionicons name="people-outline" size={14} color="#94a3b8" style={{ marginRight: 8 }} />
                            <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                                Planner Progress ({dateStr})
                            </Text>
                            <View style={{ height: 1, backgroundColor: '#1e293b', flex: 1, marginLeft: 12 }} />
                        </View>
                        <PlannerProgressTable data={filteredData} currentDate={CURRENT_DATE} onRowPress={setSelectedRow} />
                    </View>
                </ScrollView>

                <Modal
                    visible={!!selectedRow}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedRow(null)}
                >
                    <Pressable
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
                        onPress={() => setSelectedRow(null)}
                    >
                        <Pressable onPress={() => { }} style={{ marginHorizontal: 12, marginBottom: 24 }}>
                            <LinearGradient
                                colors={['rgba(30, 41, 59, 0.98)', 'rgba(15, 23, 42, 0.98)']}
                                style={{
                                    borderRadius: 20,
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="person-circle-outline" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#f1f5f9', fontSize: 16, fontWeight: '700' }}>
                                        {selectedRow?.plannerName}
                                    </Text>
                                </View>
                                <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 16, marginLeft: 28 }}>
                                    {selectedRow?.class} • {selectedRow?.country} • {selectedRow?.season}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if (selectedRow) {
                                            setSelectedClass(selectedRow.class);
                                            setSelectedCountry(selectedRow.country);
                                            setSelectedSeason(selectedRow.season);
                                        }
                                        setSelectedRow(null);
                                        router.push('/(tabs)/' as any);
                                    }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <LinearGradient
                                        colors={['rgba(14, 165, 233, 0.15)', 'rgba(14, 165, 233, 0.05)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(56, 189, 248, 0.2)',
                                        }}
                                    >
                                        <Ionicons name="grid-outline" size={18} color="#38bdf8" style={{ marginRight: 12 }} />
                                        <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>View Dashboard</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if (selectedRow) {
                                            setSelectedClass(selectedRow.class);
                                            setSelectedCountry(selectedRow.country);
                                            setSelectedSeason(selectedRow.season);
                                        }
                                        setSelectedRow(null);
                                        router.push('/(tabs)/items' as any);
                                    }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <LinearGradient
                                        colors={['rgba(168, 85, 247, 0.15)', 'rgba(168, 85, 247, 0.05)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(168, 85, 247, 0.2)',
                                        }}
                                    >
                                        <Ionicons name="shirt-outline" size={18} color="#c084fc" style={{ marginRight: 12 }} />
                                        <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>View Items</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedRow(null)}
                                    style={{ marginBottom: 4 }}
                                >
                                    <LinearGradient
                                        colors={['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(245, 158, 11, 0.2)',
                                        }}
                                    >
                                        <Ionicons name="warning-outline" size={18} color="#fbbf24" style={{ marginRight: 12 }} />
                                        <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>View Alerts</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setSelectedRow(null)}
                                    style={{ alignItems: 'center', paddingVertical: 12, marginTop: 4 }}
                                >
                                    <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '600' }}>Cancel</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Pressable>
                    </Pressable>
                </Modal>

                <ScrollToTopFAB visible={showScrollTop} onPress={scrollToTop} />
            </SafeAreaView>
        </View>
    );
}
