import React from 'react';
import { View, Text } from 'react-native';
import { usePathname } from 'expo-router';
import { GlassView } from './ui/GlassView';
import { DocsButton } from './DocsButton';
import { UploadButton } from './UploadButton';
import { ProfileButton } from './ProfileButton';
import { ThemeToggle } from './ThemeToggle';
import { useFilters } from '../context/FilterContext';

interface AppHeaderProps {
    onUpload: (files: { name: string; text: string }[]) => void;
}

const PAGE_LABELS: Record<string, string> = {
    '/home': 'Planner',
    '/': 'Dashboard',
    '/items': 'Items',
};

export const AppHeader = ({ onUpload }: AppHeaderProps) => {
    const pathname = usePathname();
    const {
        selectedCategory,
        selectedClass,
        selectedSeason,
        selectedBizLocation,
        selectedCountry,
    } = useFilters();

    const activeCount = [
        selectedCategory, selectedClass, selectedSeason,
        selectedBizLocation, selectedCountry,
    ].filter(v => v !== 'All').length;

    const pageLabel = PAGE_LABELS[pathname] ?? 'Overview';

    return (
        <GlassView intensity={10} className="px-5 py-3.5 border-b border-glass-border">
            <View className="flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                <View className="w-full md:flex-1 md:pr-4">
                    <Text className="text-stone-900 dark:text-stone-100 text-2xl font-display">Stratos</Text>
                    <Text className="text-stone-500 dark:text-stone-400 text-[10px] font-sans-semibold mt-0.5">
                        {pageLabel}
                        {activeCount > 0 ? ` • ${activeCount} filter${activeCount > 1 ? 's' : ''} active` : ''}
                    </Text>
                </View>
                <View className="w-full md:w-auto flex-row items-center justify-end flex-wrap gap-2">
                    <ThemeToggle />
                    <DocsButton />
                    <UploadButton onUpload={onUpload} />
                    <ProfileButton />
                </View>
            </View>
        </GlassView>
    );
};