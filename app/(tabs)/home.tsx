import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { GlassView } from '../../components/ui/GlassView';
import { GradientCard } from '../../components/ui/GradientCard';
import { FilterBar } from '../../components/FilterBar';
import { PlannerProgressTable } from '../../components/PlannerProgressTable';
import { ProfileButton } from '../../components/ProfileButton';
import { DocsButton } from '../../components/DocsButton';
import { UploadButton } from '../../components/UploadButton';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';
import { PlannerRow } from '../../services/plannerService';

const CURRENT_DATE = new Date('2026-02-14');


export default function HomeScreen() {
    const { plannerData, handleMultiUpload } = useData();
    const { setSelectedClass: setGlobalClass, setSelectedCountry: setGlobalCountry, setSelectedSeason: setGlobalSeason } = useFilters();
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedSeason, setSelectedSeason] = useState('All');
    const [selectedRow, setSelectedRow] = useState<PlannerRow | null>(null);

    const categories = useMemo(() => ['All', ...new Set(plannerData.map(r => r.category))], [plannerData]);
    const businessLocations = useMemo(() => ['All', ...new Set(plannerData.map(r => r.businessLocation))], [plannerData]);
    const seasons = useMemo(() => ['All', ...new Set(plannerData.map(r => r.season))], [plannerData]);

    const filteredData = useMemo(() => {
        return plannerData.filter(row =>
            (selectedCategory === 'All' || row.category === selectedCategory) &&
            (selectedLocation === 'All' || row.businessLocation === selectedLocation) &&
            (selectedSeason === 'All' || row.season === selectedSeason)
        );
    }, [plannerData, selectedCategory, selectedLocation, selectedSeason]);

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
        <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <GlassView intensity={10} className="px-5 py-4 flex-row justify-between items-center border-b border-glass-border">
                    <View>
                        <Text className="text-white text-xl font-bold">Stratos</Text>
                    </View>
                    <View className="flex-row items-center">
                        <DocsButton />
                        <UploadButton onUpload={handleMultiUpload} />
                        <ProfileButton />
                    </View>
                </GlassView>

                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
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

                    <FilterBar
                        classes={categories} selectedClass={selectedCategory} setSelectedClass={setSelectedCategory}
                        countries={businessLocations} selectedCountry={selectedLocation} setSelectedCountry={setSelectedLocation}
                        seasons={seasons} selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
                    />

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
                                            setGlobalClass(selectedRow.class);
                                            setGlobalCountry(selectedRow.country);
                                            setGlobalSeason(selectedRow.season);
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
                                            setGlobalClass(selectedRow.class);
                                            setGlobalCountry(selectedRow.country);
                                            setGlobalSeason(selectedRow.season);
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
            </SafeAreaView>
        </View>
    );
}
