import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Modal, Pressable, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { GradientCard } from '../../components/ui/GradientCard';
import { FilterBar } from '../../components/FilterBar';
import { PlannerProgressTable } from '../../components/PlannerProgressTable';
import { UpcomingDeadlines } from '../../components/UpcomingDeadlines';
import { AppHeader } from '../../components/AppHeader';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import { useTheme } from '../../context/ThemeContext';
import { PlannerRow } from '../../services/plannerService';
import { ScrollToTopFAB } from '../../components/ScrollToTopFAB';
import { TopGradient } from '../../components/TopGradient';

const CURRENT_DATE = new Date();


export default function HomeScreen() {
    const { plannerData, handleMultiUpload, data } = useData();
    const { isDark, colors } = useTheme();
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
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
            <TopGradient />
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
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
                            tintColor={colors.accent}
                            colors={[colors.accent]}
                            progressBackgroundColor={colors.refreshBg}
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
                    <View className="w-full">
                        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                            <GradientCard
                                colors={['rgba(56, 189, 248, 0.06)', 'rgba(168, 85, 247, 0.04)']}
                                className="p-4 mb-5"
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                                        Overall Team Progress
                                    </Text>
                                    <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800' }}>
                                        {overallProgress}%
                                    </Text>
                                </View>
                                <View style={{
                                    height: 10,
                                    backgroundColor: colors.track,
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                    borderWidth: 0.5,
                                    borderColor: colors.border,
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
                                <Text style={{ color: colors.textSecondary, fontSize: 10, marginTop: 6, textAlign: 'right' }}>
                                    {filteredData.length} assignments tracked
                                </Text>
                            </GradientCard>
                        </View>

                        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 20 }}>
                            <View className="flex-col md:flex-row">
                                <View className="w-full md:w-[60%] md:px-1">
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Ionicons name="people-outline" size={14} color={colors.textSecondary} style={{ marginRight: 8 }} />
                                        <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                                            Planner Progress ({dateStr})
                                        </Text>
                                        <View style={{ height: 1, backgroundColor: colors.track, flex: 1, marginLeft: 12 }} />
                                    </View>
                                    <PlannerProgressTable data={filteredData} currentDate={CURRENT_DATE} onRowPress={setSelectedRow} />
                                </View>
                                <View className="w-full md:w-[40%] md:px-1">
                                    <UpcomingDeadlines data={filteredData} currentDate={CURRENT_DATE} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <Modal
                    visible={!!selectedRow}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedRow(null)}
                >
                    <Pressable
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
                        onPress={() => setSelectedRow(null)}
                    >
                        <Pressable onPress={() => { }} style={{ marginHorizontal: 12, marginBottom: 24, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
                            <LinearGradient
                                colors={isDark
                                    ? ['rgba(30, 41, 59, 0.98)', 'rgba(15, 23, 42, 0.98)']
                                    : ['rgba(255, 255, 255, 0.98)', 'rgba(241, 245, 249, 0.98)']}
                                style={{
                                    borderRadius: 20,
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="person-circle-outline" size={20} color={colors.accent} style={{ marginRight: 8 }} />
                                    <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700' }}>
                                        {selectedRow?.plannerName}
                                    </Text>
                                </View>
                                <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 16, marginLeft: 28 }}>
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
                                        colors={['rgba(14, 165, 233, 0.12)', 'rgba(14, 165, 233, 0.04)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(2, 132, 199, 0.3)',
                                        }}
                                    >
                                        <Ionicons name="grid-outline" size={18} color={colors.accent} style={{ marginRight: 12 }} />
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }}>View Dashboard</Text>
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
                                        colors={['rgba(168, 85, 247, 0.12)', 'rgba(168, 85, 247, 0.04)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(147, 51, 234, 0.3)',
                                        }}
                                    >
                                        <Ionicons name="shirt-outline" size={18} color="#7c3aed" style={{ marginRight: 12 }} />
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }}>View Items</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedRow(null)}
                                    style={{ marginBottom: 4 }}
                                >
                                    <LinearGradient
                                        colors={['rgba(245, 158, 11, 0.12)', 'rgba(245, 158, 11, 0.04)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(217, 119, 6, 0.3)',
                                        }}
                                    >
                                        <Ionicons name="warning-outline" size={18} color="#d97706" style={{ marginRight: 12 }} />
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }}>View Alerts</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setSelectedRow(null)}
                                    style={{ alignItems: 'center', paddingVertical: 12, marginTop: 4 }}
                                >
                                    <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '600' }}>Cancel</Text>
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
