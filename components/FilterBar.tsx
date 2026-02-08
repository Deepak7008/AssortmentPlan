import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

interface FilterBarProps {
    classes: string[];
    selectedClass: string;
    setSelectedClass: (value: string) => void;
    countries: string[];
    selectedCountry: string;
    setSelectedCountry: (value: string) => void;
    seasons: string[];
    selectedSeason: string;
    setSelectedSeason: (value: string) => void;
}

const FilterSelect = ({ label, value, options, onChange }: {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void
}) => (
    <View className="flex-1 mx-1">
        <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1 ml-1">{label}</Text>

        <View className="h-11">
            {/* Custom Visual UI (Background & Text) - Always Visible */}
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-slate-800 rounded-lg border border-slate-700 flex-row items-center justify-between px-3 pointer-events-none">
                <Text className="text-slate-200 text-xs font-semibold" numberOfLines={1}>
                    {value || "All"}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#94a3b8" />
            </View>

            {/* Platform Specific Trigger */}
            {Platform.OS === 'web' ? (
                <select
                    value={value}
                    onChange={(e: any) => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        height: '100%',
                        opacity: 0, // Invisible overlay
                        cursor: 'pointer',
                        appearance: 'none',
                        border: 'none'
                    }}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    style={{
                        width: '100%',
                        height: '100%',
                        opacity: 0, // Invisible overlay on top of custom UI
                        backgroundColor: 'transparent'
                    }}
                    dropdownIconColor="transparent"
                    mode="dialog"
                >
                    {options.map((opt) => (
                        <Picker.Item
                            key={opt} label={opt} value={opt}
                            color="#1e293b" // Standard text color for Android Dialog
                        />
                    ))}
                </Picker>
            )}
        </View>
    </View>
);

export const FilterBar = ({
    classes, selectedClass, setSelectedClass,
    countries, selectedCountry, setSelectedCountry,
    seasons, selectedSeason, setSelectedSeason
}: FilterBarProps) => {
    return (
        <View
            className="py-3 px-3 border-b border-slate-800"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.98)' }}
        >
            <View className="flex-row w-full md:max-w-4xl md:mx-auto">
                <FilterSelect
                    label="Class"
                    value={selectedClass}
                    options={classes}
                    onChange={setSelectedClass}
                />
                <FilterSelect
                    label="Season"
                    value={selectedSeason}
                    options={seasons}
                    onChange={setSelectedSeason}
                />
                <FilterSelect
                    label="Country"
                    value={selectedCountry}
                    options={countries}
                    onChange={setSelectedCountry}
                />
            </View>
        </View>
    );
};
