import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Filter, X } from 'lucide-react-native';

interface FilterBarProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    classes: string[];
    selectedClass: string;
    setSelectedClass: (value: string) => void;
    seasons: string[];
    selectedSeason: string;
    setSelectedSeason: (value: string) => void;
    bizLocations: string[];
    selectedBizLocation: string;
    setSelectedBizLocation: (value: string) => void;
    countries: string[];
    selectedCountry: string;
    setSelectedCountry: (value: string) => void;
}

// ── Individual Filter Chip ───────────────────────────────────────────────

interface ChipProps {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}

const FilterChip = ({ label, value, options, onChange }: ChipProps) => {
    const isActive = value !== 'All';
    const displayText = isActive ? value : label;
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={{ marginRight: 8, position: 'relative' }}>
            <TouchableOpacity
                activeOpacity={Platform.OS === 'web' ? 1 : 0.7}
                onPress={() => {
                    if (Platform.OS !== 'web') {
                        setModalVisible(true);
                    }
                }}
            >
                {/* Visual chip layer */}
                <View
                    style={{
                        height: 34,
                        paddingHorizontal: 14,
                        borderRadius: 17,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                        borderWidth: 1,
                        borderColor: isActive ? 'rgba(56, 189, 248, 0.5)' : 'rgba(100, 116, 139, 0.3)',
                    }}
                >
                    <Text
                        style={{
                            color: isActive ? '#38bdf8' : '#94a3b8',
                            fontSize: 12,
                            fontWeight: isActive ? '700' : '600',
                            marginRight: 4,
                        }}
                        numberOfLines={1}
                    >
                        {displayText}
                    </Text>
                    <Ionicons
                        name="chevron-down"
                        size={12}
                        color={isActive ? '#38bdf8' : '#64748b'}
                    />
                </View>
            </TouchableOpacity>

            {/* Hidden Picker implementations */}
            {Platform.OS === 'web' ? (
                <select
                    value={value}
                    onChange={(e: any) => onChange(e.target.value)}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        appearance: 'none',
                        border: 'none',
                    } as any}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24}}>
                            <TouchableWithoutFeedback>
                                <View style={{backgroundColor: '#1e293b', width: '100%', maxWidth: 320, borderRadius: 16, maxHeight: '80%', overflow: 'hidden', borderWidth: 1, borderColor: '#334155'}}>
                                    <View style={{paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155', backgroundColor: '#0f172a'}}>
                                        <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '700'}}>Select {label}</Text>
                                    </View>
                                    <ScrollView bounces={false}>
                                        {options.map((opt) => (
                                            <TouchableOpacity 
                                                key={opt}
                                                onPress={() => { onChange(opt); setModalVisible(false); }} 
                                                style={{
                                                    paddingVertical: 16, 
                                                    paddingHorizontal: 20,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: 'rgba(51, 65, 85, 0.5)',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    backgroundColor: value === opt ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
                                                }}
                                            >
                                                <Text style={{color: value === opt ? '#38bdf8' : '#cbd5e1', fontSize: 15, fontWeight: value === opt ? '700' : '500'}}>{opt}</Text>
                                                {value === opt && <Ionicons name="checkmark" size={18} color="#38bdf8" />}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

// ── Main FilterBar ───────────────────────────────────────────────────────

export const FilterBar = ({
    categories, selectedCategory, setSelectedCategory,
    classes, selectedClass, setSelectedClass,
    seasons, selectedSeason, setSelectedSeason,
    bizLocations, selectedBizLocation, setSelectedBizLocation,
    countries, selectedCountry, setSelectedCountry,
}: FilterBarProps) => {
    const activeCount = [
        selectedCategory, selectedClass, selectedSeason,
        selectedBizLocation, selectedCountry,
    ].filter(v => v !== 'All').length;

    const clearAll = () => {
        setSelectedCategory('All');
        setSelectedClass('All');
        setSelectedSeason('All');
        setSelectedBizLocation('All');
        setSelectedCountry('All');
    };

    return (
        <View
            style={{
                paddingTop: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(30, 41, 59, 0.6)',
                backgroundColor: 'transparent',
            }}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    alignItems: 'center',
                }}
            >
                {/* Combined Filter / Clear Icon */}
                <TouchableOpacity
                    onPress={clearAll}
                    disabled={activeCount === 0}
                    style={{
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: activeCount > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                        borderWidth: 1,
                        borderColor: activeCount > 0 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(100, 116, 139, 0.3)',
                        marginRight: 12,
                        position: 'relative',
                    }}
                >
                    <Filter size={16} color={activeCount > 0 ? '#38bdf8' : '#64748b'} strokeWidth={2.5} />
                    {activeCount > 0 && (
                        <View style={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            backgroundColor: '#ef4444',
                            borderWidth: 2,
                            borderColor: '#020617',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <X size={8} color="white" strokeWidth={4} />
                        </View>
                    )}
                </TouchableOpacity>

                <FilterChip
                    label="Category"
                    value={selectedCategory}
                    options={categories}
                    onChange={setSelectedCategory}
                />
                <FilterChip
                    label="Class"
                    value={selectedClass}
                    options={classes}
                    onChange={setSelectedClass}
                />
                <FilterChip
                    label="Season"
                    value={selectedSeason}
                    options={seasons}
                    onChange={setSelectedSeason}
                />
                <FilterChip
                    label="Biz Location"
                    value={selectedBizLocation}
                    options={bizLocations}
                    onChange={setSelectedBizLocation}
                />
                <FilterChip
                    label="Country"
                    value={selectedCountry}
                    options={countries}
                    onChange={setSelectedCountry}
                />
            </ScrollView>
        </View>
    );
};
