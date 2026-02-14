import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import clsx from 'clsx';

import { GlassView } from '../../components/ui/GlassView';
import { GradientCard } from '../../components/ui/GradientCard';
import { FilterBar } from '../../components/FilterBar';
import { LastSeasonKPIs } from '../../components/LastSeasonKPIs';
import { ClassPerformanceTable } from '../../components/ClassPerformanceTable';
import { RegionalHeatmap } from '../../components/RegionalHeatmap';
import { UploadButton } from '../../components/UploadButton';
import { DocsButton } from '../../components/DocsButton';
import { ProfileButton } from '../../components/ProfileButton';
import { useData } from '../../context/DataContext';
import { useFilters } from '../../context/FilterContext';

const SectionHeader = ({ title, icon }: { title: string, icon?: keyof typeof Ionicons.glyphMap }) => (
  <View className="flex-row items-center mb-4 mt-6 pl-1">
    {icon && <Ionicons name={icon} size={16} color="#94a3b8" style={{ marginRight: 8 }} />}
    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      {title}
    </Text>
    <View className="h-[1px] bg-slate-800 flex-1 ml-4" />
  </View>
);

const ProgressBar = ({ label, value, max, colorColors = ['#0ea5e9', '#38bdf8'] }: any) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1.5">
        <Text className="text-slate-300 text-xs font-medium">{label}</Text>
        <Text className="text-white text-xs font-bold">{percent.toFixed(0)}%</Text>
      </View>
      <View className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
        <LinearGradient
          colors={colorColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${percent}%`, height: '100%', borderRadius: 999 }}
        />
      </View>
    </View>
  );
};

export default function Dashboard() {
  const { data, loading, handleMultiUpload } = useData();
  const { selectedClass, setSelectedClass, selectedCountry, setSelectedCountry, selectedSeason, setSelectedSeason } = useFilters();

  const classes = useMemo(() => ['All', ...new Set(data.map(d => d.className))], [data]);
  const countries = useMemo(() => ['All', ...new Set(data.map(d => d.country))], [data]);
  const seasons = useMemo(() => ['All', ...new Set(data.map(d => d.season))], [data]);

  const filteredData = data.filter(item =>
    (selectedClass === 'All' || item.className === selectedClass) &&
    (selectedCountry === 'All' || item.country === selectedCountry) &&
    (selectedSeason === 'All' || item.season === selectedSeason)
  );

  const approvedItems = filteredData.filter(i => i.status === 'Approved');

  const totalSales = approvedItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros * item.storeCount), 0);
  const budget = totalSales * 1.47;
  const salesPercent = budget > 0 ? Math.round((totalSales / budget) * 100) : 0;

  const totalMarginVal = approvedItems.reduce((sum, item) => sum + (item.margin * item.ros * item.storeCount), 0);
  const marginPercent = totalSales > 0 ? Math.round((totalMarginVal / totalSales) * 100) : 0;

  const lastSeasonData = useMemo(() => ({
    salesActual: approvedItems.reduce((sum, item) => sum + (item.lastYearSales || 0), 0),
    salesPlan: approvedItems.reduce((sum, item) => sum + (item.lastYearPlan || 0), 0),
    marginPercent: approvedItems.length > 0
      ? approvedItems.reduce((sum, item) => sum + (item.lastYearMarginPercent || 0), 0) / approvedItems.length
      : 0,
    marginPlan: approvedItems.length > 0
      ? approvedItems.reduce((sum, item) => sum + (item.lastYearMarginPlan || 0), 0) / approvedItems.length
      : 0,
    roi: approvedItems.length > 0
      ? approvedItems.reduce((sum, item) => sum + (item.lastYearROI || 0), 0) / approvedItems.length
      : 0,
    roiPlan: approvedItems.length > 0
      ? approvedItems.reduce((sum, item) => sum + (item.lastYearROIPlan || 0), 0) / approvedItems.length
      : 0,
    sellThru: approvedItems.length > 0
      ? approvedItems.reduce((sum, item) => sum + (item.sellThru || 0), 0) / approvedItems.length
      : 0,
    sellThruPlan: approvedItems.length > 0
      ? approvedItems.reduce((sum, item) => sum + (item.sellThruPlan || 0), 0) / approvedItems.length
      : 0,
  }), [approvedItems]);

  const classPerformanceData = useMemo(() => {
    const classNames = [...new Set(approvedItems.map(i => i.className))];
    return classNames.map(className => {
      const classItems = approvedItems.filter(item => item.className === className);
      const sales = classItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros * item.storeCount), 0);
      const avgMargin = classItems.length > 0
        ? Math.round(classItems.reduce((sum, item) => sum + parseFloat(item.marginPercent), 0) / classItems.length)
        : 0;
      const avgROI = classItems.length > 0
        ? classItems.reduce((sum, item) => sum + item.roi, 0) / classItems.length
        : 0;
      return {
        className,
        sales,
        marginPercent: avgMargin,
        roi: avgROI,
        salesChange: Math.floor(Math.random() * 10) - 3,
        marginChange: Math.floor(Math.random() * 6) - 2,
      };
    }).filter(d => d.sales > 0 || approvedItems.some(i => i.className === d.className));
  }, [approvedItems]);

  const heatmapData = useMemo(() => {
    const regions = [...new Set(approvedItems.map(i => i.region))];
    const classNames = [...new Set(approvedItems.map(i => i.className))];
    const result: { region: string; className: string; sales: number }[] = [];

    regions.forEach(region => {
      classNames.forEach(className => {
        const regionClassItems = approvedItems.filter(
          item => item.region === region && item.className === className
        );
        const sales = regionClassItems.reduce((sum, item) => sum + (item.sellingPrice * item.ros * item.storeCount), 0);
        result.push({ region, className, sales });
      });
    });
    return result;
  }, [approvedItems]);

  const vsLYPercent = useMemo(() => {
    const totalLastYearSales = approvedItems.reduce((sum, item) => sum + (item.lastYearSales || 0), 0);
    return totalLastYearSales > 0
      ? Math.round(((totalSales - totalLastYearSales) / totalLastYearSales) * 100)
      : 0;
  }, [approvedItems, totalSales]);

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} className="flex-1">
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
          className="flex-1"
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <FilterBar
            classes={classes} selectedClass={selectedClass} setSelectedClass={setSelectedClass}
            countries={countries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
            seasons={seasons} selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason}
          />

          <View className="w-full md:max-w-7xl md:self-center">
            <View className="px-4 pt-4 pb-2">
              <SectionHeader title="Current Season" icon="calendar-outline" />
              <GradientCard className="p-4 mb-2" colors={['rgba(56, 189, 248, 0.1)', 'rgba(30, 41, 59, 0.6)']}>
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">Total Sales Budget</Text>
                    <Text className="text-white text-2xl font-bold">${(budget / 1000).toFixed(1)}k</Text>
                  </View>
                  <View className={clsx(
                    "px-2 py-1 rounded",
                    vsLYPercent >= 0 ? "bg-green-500/20" : "bg-red-500/20"
                  )}>
                    <Text className={clsx(
                      "text-xs font-bold",
                      vsLYPercent >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {vsLYPercent >= 0 ? '+' : ''}{vsLYPercent}% vs LY
                    </Text>
                  </View>
                </View>
                <ProgressBar label="Sales %" value={salesPercent} max={100} colorColors={['#22c55e', '#4ade80']} />
                <ProgressBar label="Margin %" value={marginPercent} max={100} colorColors={['#f59e0b', '#fbbf24']} />
              </GradientCard>
            </View>

            <View className="px-4 pb-20">
              <LastSeasonKPIs data={lastSeasonData} />
              <ClassPerformanceTable data={classPerformanceData} />
              <RegionalHeatmap data={heatmapData} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
