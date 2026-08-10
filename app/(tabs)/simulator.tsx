import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { TopGradient } from '../../components/TopGradient';
import { DocsButton } from '../../components/DocsButton';
import { ScrollToTopFAB } from '../../components/ScrollToTopFAB';
import { SimulationControls } from '../../components/simulator/SimulationControls';
import { ExitFactorConfig } from '../../components/simulator/ExitFactorConfig';
import { ResultsTable } from '../../components/simulator/ResultsTable';
import { ItemDetailsTable } from '../../components/simulator/ItemDetailsTable';
import { CalculationPanel } from '../../components/simulator/CalculationPanel';
import {
    DEMO_ITEMS, DEFAULT_WEIGHTS, DEFAULT_ELASTICITY, DEFAULT_PRODUCTIVITY, DEFAULT_SUBSTITUTION,
    buildBaseline, runSimulation,
    SimulationResult, ExitWeights,
} from '../../services/simulationService';

const SectionHeader = ({ title }: { title: string }) => {
    return (
        <View className="flex-row items-center mb-4 mt-6 pl-1">
            <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {title}
            </Text>
            <View className="h-[1px] bg-slate-200 dark:bg-slate-700 flex-1 ml-4" />
        </View>
    );
};

export default function SimulatorScreen() {
    const { isDark } = useTheme();
    const base = useMemo(() => buildBaseline(DEMO_ITEMS), []);

    const [targetOptions, setTargetOptions] = useState('7');
    const [targetASP, setTargetASP] = useState('50');
    const [targetCP, setTargetCP] = useState('25');
    const [elasticity, setElasticity] = useState(String(DEFAULT_ELASTICITY));
    const [productivity, setProductivity] = useState(String(DEFAULT_PRODUCTIVITY));
    const [substitution, setSubstitution] = useState(String(DEFAULT_SUBSTITUTION));
    const [weights, setWeights] = useState<ExitWeights>(DEFAULT_WEIGHTS);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [lastRunAt, setLastRunAt] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(true);
    const [calcOpen, setCalcOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const weightsTotal = weights.sellThru + weights.lySales + weights.margin;
    const canRun = weightsTotal === 100;

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setShowScrollTop(e.nativeEvent.contentOffset.y > 400);
    }, []);

    const scrollToTop = useCallback(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []);

    const handleControlChange = (field: string, value: string) => {
        setError(null);
        if (field === 'targetOptions') setTargetOptions(value);
        if (field === 'targetASP') setTargetASP(value);
        if (field === 'targetCP') setTargetCP(value);
        if (field === 'elasticity') setElasticity(value);
        if (field === 'productivity') setProductivity(value);
        if (field === 'substitution') setSubstitution(value);
    };

    const handleWeightChange = (key: keyof ExitWeights, value: number) => {
        setWeights(prev => ({ ...prev, [key]: value }));
        setError(null);
    };

    const handleRun = () => {
        const tOpt = parseInt(targetOptions, 10);
        const tAsp = parseFloat(targetASP);
        const tCp = parseFloat(targetCP);
        const el = parseFloat(elasticity);
        const prod = parseFloat(productivity);
        const sub = parseFloat(substitution);

        if (isNaN(tOpt) || tOpt < 1) {
            setError('Target Options must be a whole number of at least 1.');
            return;
        }
        if (isNaN(tAsp) || tAsp <= 0) {
            setError('Target ASP must be greater than 0.');
            return;
        }
        if (isNaN(tCp) || tCp <= 0) {
            setError('Target CP must be greater than 0.');
            return;
        }
        if (isNaN(el) || el >= 0) {
            setError('Price Elasticity must be a negative number (e.g. -1.20).');
            return;
        }
        if (isNaN(prod) || prod < 0 || prod > 100) {
            setError('New Option Productivity must be between 0 and 100%.');
            return;
        }
        if (isNaN(sub) || sub < 0 || sub > 100) {
            setError('Substitution Rate must be between 0 and 100%.');
            return;
        }
        if (weightsTotal !== 100) {
            setError('Exit Factor weights must total exactly 100%.');
            return;
        }

        setResult(runSimulation(DEMO_ITEMS, {
            targetOptions: tOpt,
            targetASP: tAsp,
            targetCP: tCp,
            priceElasticity: el,
            newOptionProductivity: prod,
            substitutionRate: sub,
        }, weights));
        setLastRunAt(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
        setError(null);
    };

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-950">
            <TopGradient />
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <SafeAreaView edges={['top']} className="flex-1">
                <ScrollView
                    ref={scrollRef}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                >
                    <View className="w-full px-4">
                        {/* Page header */}
                        <View className="flex-row items-center justify-between pt-4">
                            <View className="flex-1 pr-4">
                                <Text className="text-slate-900 dark:text-white text-2xl font-bold">
                                    Assortment Simulator
                                </Text>
                                <Text className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-4">
                                    Evaluate the impact of assortment depth and pricing decisions on Units, Sales, Margin, and Sell Through.
                                </Text>
                            </View>
                            <View className="items-end">
                                <View className="flex-row items-center">
                                    <DocsButton />
                                    <TouchableOpacity
                                        onPress={handleRun}
                                        disabled={!canRun}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient
                                            colors={canRun ? ['#0284c7', '#0ea5e9'] : ['#64748b', '#94a3b8']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            className="px-5 py-2.5 rounded-xl"
                                            style={{ opacity: canRun ? 1 : 0.6 }}
                                        >
                                            <Text className="text-white text-sm font-bold">
                                                {result ? 'Simulation Updated' : 'Run Simulation'}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                {lastRunAt && (
                                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] mt-1.5 font-medium">
                                        Last simulated: {lastRunAt}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {error && (
                            <View className="mt-3 bg-red-100 dark:bg-red-500/15 border border-red-300 dark:border-red-500/40 rounded-xl px-4 py-2.5">
                                <Text className="text-red-600 dark:text-red-400 text-xs font-semibold">
                                    {error}
                                </Text>
                            </View>
                        )}

                        {/* Simulation Controls */}
                        <SectionHeader title="Simulation Controls" />
                        <SimulationControls
                            targetOptions={targetOptions}
                            targetASP={targetASP}
                            targetCP={targetCP}
                            elasticity={elasticity}
                            productivity={productivity}
                            substitution={substitution}
                            onChange={handleControlChange}
                            baseOptions={base.options}
                            baseASP={base.asp}
                            baseCP={base.avgCp}
                        />

                        {/* Exit Factor Configuration */}
                        <SectionHeader title="Exit Factor Configuration" />
                        <ExitFactorConfig weights={weights} onWeightChange={handleWeightChange} />

                        {/* Simulation Results */}
                        <SectionHeader title="Simulation Results" />
                        <ResultsTable result={result} />

                        {/* Item Level Details */}
                        <View className="mt-6">
                            <ItemDetailsTable
                                items={DEMO_ITEMS}
                                result={result}
                                weights={weights}
                                expanded={detailsOpen}
                                onToggle={() => setDetailsOpen(v => !v)}
                            />
                        </View>

                        {/* How Was This Calculated */}
                        <View className="mt-6">
                            <CalculationPanel
                                result={result}
                                expanded={calcOpen}
                                onToggle={() => setCalcOpen(v => !v)}
                            />
                        </View>
                    </View>
                </ScrollView>

                <ScrollToTopFAB visible={showScrollTop} onPress={scrollToTop} />
            </SafeAreaView>
        </View>
    );
}
