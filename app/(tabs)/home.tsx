import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/AppHeader';
import { FilterBar } from '../../components/FilterBar';
import { PlannerProgressTable } from '../../components/PlannerProgressTable';
import { ScrollToTopFAB } from '../../components/ScrollToTopFAB';
import { GradientCard } from '../../components/ui/GradientCard';
import { UpcomingDeadlines } from '../../components/UpcomingDeadlines';
import { EmptyState } from '../../components/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import { useTheme } from '../../context/ThemeContext';
import { PlannerRow } from '../../services/plannerService';

const CURRENT_DATE = new Date();

const HomeSkeleton = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <Skeleton height={120} radius={16} style={{ marginBottom: 20 }} />
        <Skeleton height={280} radius={16} />
    </View>
);


export default function HomeScreen() {
    const { plannerData, handleMultiUpload, data, loading } = useData();
    const { isDark, colors } = useTheme();
    const {
        selectedCategory, setSelectedCategory,
        selectedClass, setSelectedClass,
        selectedSeason, setSelectedSeason,
        selectedBizLocation, setSelectedBizLocation,
        selectedCountry, setSelectedCountry,
        resetFilters,
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
        <View className="flex-1 bg-stone-50 dark:bg-stone-900">
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <SafeAreaView edges={['top']} className="flex-1">

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
                            <HomeSkeleton />
                        ) : plannerData.length === 0 && data.length === 0 ? (
                            <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                                <EmptyState
                                    icon="cloud-upload-outline"
                                    title="No data yet"
                                    message="Load the demo dataset or upload your own CSV files to explore the assortment."
                                    actionLabel="Load Demo Data"
                                    onAction={() => handleMultiUpload([{ name: '__RESET__', text: '__RESET__' }])}
                                />
                            </View>
                        ) : plannerData.length === 0 ? (
                            <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                                <EmptyState
                                    icon="clipboard-outline"
                                    title="No assignments yet"
                                    message="Upload a planner CSV to track assignment progress and deadlines."
                                />
                            </View>
                        ) : filteredData.length === 0 ? (
                            <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                                <EmptyState
                                    icon="filter-outline"
                                    title="No assignments match your filters"
                                    message="Try adjusting or clearing the active filters to see more assignments."
                                    actionLabel="Clear Filters"
                                    onAction={resetFilters}
                                />
                            </View>
                        ) : (
                            <>
                        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                            <GradientCard
                                className="p-4 mb-5"
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ color: colors.textPrimary, fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>
                                        Overall Team Progress
                                    </Text>                                    <Text style={{ color: colors.textPrimary, fontSize: 20, fontFamily: 'Inter_800ExtraBold', fontVariant: ['tabular-nums'] }}>
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
                                        colors={['#F59E0B', '#D97706']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            width: `${overallProgress}%`,
                                            height: '100%',
                                            borderRadius: 5,
                                        }}
                                    />
                                </View>
                                <Text style={{ color: colors.textSecondary, fontSize: 10, marginTop: 6, textAlign: 'right', fontVariant: ['tabular-nums'] }}>
                                    {filteredData.length} assignments tracked
                                </Text>
                            </GradientCard>
                        </View>

                        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 20 }}>
                            <View className="flex-col md:flex-row">
                                <View className="w-full md:w-[60%] md:px-1">
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Ionicons name="people-outline" size={15} color={colors.accent} style={{ marginRight: 8 }} />
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>
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
                            </>
                        )}
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
                                    ? ['rgba(41, 37, 36, 0.98)', 'rgba(41, 37, 36, 0.98)']
                                    : ['rgba(255, 255, 255, 0.98)', 'rgba(245, 245, 244, 0.98)']}
                                style={{
                                    borderRadius: 20,
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="person-circle-outline" size={20} color={colors.accent} style={{ marginRight: 8 }} />
                                    <Text style={{ color: colors.textPrimary, fontSize: 16, fontFamily: 'Inter_700Bold' }}>
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
                                        <Ionicons name="grid-outline" size={18} color={colors.accent} style={{ marginRight: 12 }} />
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>View Dashboard</Text>
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
                                        colors={['rgba(28, 25, 23, 0.06)', 'rgba(28, 25, 23, 0.02)']}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <Ionicons name="shirt-outline" size={18} color={colors.textSecondary} style={{ marginRight: 12 }} />
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>View Items</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/*<TouchableOpacity
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
                                        <Text style={{ color: colors.textPrimary, fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>View Alerts</Text>
                                    </LinearGradient>
                                </TouchableOpacity>*/}

                                <TouchableOpacity
                                    onPress={() => setSelectedRow(null)}
                                    style={{ alignItems: 'center', paddingVertical: 12, marginTop: 4 }}
                                >
                                    <Text style={{ color: colors.textSecondary, fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>Cancel</Text>
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
