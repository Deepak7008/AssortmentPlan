import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/ui/GlassView';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
    { icon: 'speedometer-outline', title: 'Dashboard', desc: 'KPI summary, sales vs. plan, class performance and regional heatmaps.' },
    { icon: 'home-outline', title: 'Planner Progress', desc: 'Track team progress against Option, Line and Buy plan deadlines.' },
    { icon: 'shirt-outline', title: 'Item Explorer', desc: 'Browse assortment options with attribute distribution and economics.' },
    { icon: 'funnel-outline', title: 'Smart Filters', desc: 'Cascading filters for Category, Class, Season, Business Location and Country.' },
    { icon: 'cloud-upload-outline', title: 'CSV Upload', desc: 'Upload Planner Progress and Item Data CSVs — auto-detected for you.' },
    { icon: 'stats-chart-outline', title: 'Assortment Simulator', desc: 'Model assortment depth, pricing and item exits to see the impact on key planning KPIs.' },
    { icon: 'phone-portrait-outline', title: 'Works Everywhere', desc: 'Open the same link on any device — desktop, tablet or mobile browser.' },
] as const;

const HOW_TO = [
    { step: '1', text: 'Tap the cloud icon (top right) to upload your Planner Progress and Item Data CSVs — or load the demo data.' },
    { step: '2', text: 'Use the filter bar to narrow by Category, Class, Season, Business Location or Country.' },
    { step: '3', text: 'Review planner progress on Home, KPIs and heatmaps on Dashboard, and product options in Items.' },
    { step: '4', text: 'Tap any planner row to jump straight to a pre-filtered Dashboard or Items view.' },
] as const;

const SIM_HOW_TO = [
    { step: '1', text: 'Open the Simulator tab and set your Target Options and Target ASP for the desired assortment outcome.' },
    { step: '2', text: 'Adjust the Exit Factor weights (Sell Thru, LY Sales, Margin %) to define what matters most — they must total 100%.' },
    { step: '3', text: 'Press Run Simulation to see the updated KPIs and the item-level exit decisions.' },
    { step: '4', text: 'Expand Item Level Details for per-item exit scores, and How Was This Calculated for the full math walkthrough.' },
] as const;

const SIM_DATA = [
    { text: 'Exit Factor: Each item is scored from 0–1 against the class average for defined KPI using MAX(0, 1 − Item Value / Class Average). The planner-defined weights combine these scores into a single Exit Factor used to rank items from weakest to strongest. A score of 0 means the item is at or above the class average across that metric.' },
    { text: 'Demand: an ASP change is converted into a demand change using the price elasticity assumption; Assortment cuts recover demand through the substitution rate, while additions add demand through new-option productivity.' },
    { text: 'KPIs: Units, Sales, Margin, Sell Thru and ASP are recomputed from the simulated units and pricing.' },
] as const;

const TECH_STACK = 'Expo / React Native · TypeScript · NativeWind · Expo Router';

export default function AboutScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <View className="flex-1 bg-stone-50 dark:bg-stone-900">
            <SafeAreaView edges={['top']} className="flex-1">
                <View className="relative">
                    <GlassView intensity={10} className="px-5 py-4 border-b border-glass-border flex-row justify-between items-center">
                        <View>
                            <Text className="text-amber-700 dark:text-amber-400 text-xl font-sans-bold">About</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.track, alignItems: 'center', justifyContent: 'center' }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </GlassView>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                >
                    <View className="items-center mb-6">
                        <Text className="text-stone-900 dark:text-white text-3xl font-display">Stratos</Text>
                        <Text className="text-stone-700 dark:text-stone-200 text-sm font-sans-medium text-center mt-3 leading-6">
                            Strategic Oversight for the Retail Frontier. A native tool for Planners
                            and Executives to review and track daily assortment planning activities.
                        </Text>
                    </View>

                    <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                        Features
                    </Text>
                    <View className="flex-row flex-wrap -mx-1 mb-6">
                        {FEATURES.map(f => (
                            <View key={f.title} className="w-1/2 p-1">
                                <GlassView intensity={10} className="p-3 rounded-xl flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <Ionicons name={f.icon} size={16} color={colors.accent} style={{ marginRight: 6 }} />
                                        <Text className="text-stone-900 dark:text-white text-xs font-sans-bold">{f.title}</Text>
                                    </View>
                                    <Text className="text-stone-700 dark:text-stone-200 text-[13px] font-sans-medium leading-5">{f.desc}</Text>
                                </GlassView>
                            </View>
                        ))}
                    </View>

                    <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                        How to Use
                    </Text>
                    <GlassView intensity={10} className="p-4 rounded-xl mb-6">
                        {HOW_TO.map((item, index) => (
                            <View key={item.step} className="flex-row mb-3 last:mb-0">
                                <View className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-600/20 items-center justify-center mr-3 mt-0.5">
                                    <Text className="text-amber-800 dark:text-amber-400 text-[11px] font-sans-bold">{item.step}</Text>
                                </View>
                                <Text className="flex-1 text-stone-700 dark:text-stone-200 text-[13px] font-sans-medium leading-6">{item.text}</Text>
                            </View>
                        ))}
                    </GlassView>

                    <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                        Assortment Simulator — How to Use & Data
                    </Text>
                    <GlassView intensity={10} className="p-4 rounded-xl mb-3">
                        <Text className="text-stone-900 dark:text-white text-xs font-sans-bold uppercase tracking-wider mb-3">
                            Using the Simulator
                        </Text>
                        {SIM_HOW_TO.map(item => (
                            <View key={item.step} className="flex-row mb-3 last:mb-0">
                                <View className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-600/20 items-center justify-center mr-3 mt-0.5">
                                    <Text className="text-amber-800 dark:text-amber-400 text-[11px] font-sans-bold">{item.step}</Text>
                                </View>
                                <Text className="flex-1 text-stone-700 dark:text-stone-200 text-[13px] font-sans-medium leading-6">{item.text}</Text>
                            </View>
                        ))}
                    </GlassView>
                    <GlassView intensity={10} className="p-4 rounded-xl mb-6">
                        <Text className="text-stone-900 dark:text-white text-xs font-sans-bold uppercase tracking-wider mb-3">
                            How the Data Is Calculated
                        </Text>
                        {SIM_DATA.map((item, index) => (
                            <View key={index} className="flex-row mb-3 last:mb-0">
                                <View className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 mr-3" />
                                <Text className="flex-1 text-stone-700 dark:text-stone-200 text-[13px] font-sans-medium leading-6">{item.text}</Text>
                            </View>
                        ))}
                    </GlassView>

                    <Text className="text-sm font-sans-semibold text-stone-700 dark:text-stone-200 mb-3 pl-1">
                        Tech Stack
                    </Text>
                    <GlassView intensity={10} className="p-4 rounded-xl mb-6">
                        <Text className="text-stone-700 dark:text-stone-200 text-xs font-sans-medium leading-6">{TECH_STACK}</Text>
                    </GlassView>

                    <Text className="text-stone-400 dark:text-stone-500 text-[10px] text-center mt-2">
                        © 2026 Stratos. Built for assortment planning teams.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
