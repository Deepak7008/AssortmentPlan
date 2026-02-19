import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAssortmentData, AssortmentItem, parseCSV } from '../services/dataService';
import { fetchPlannerData, parsePlannerCSV, PlannerRow } from '../services/plannerService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    ASSORTMENT: '@assortment_data',
    PLANNER: '@planner_data',
};

interface UploadedFile {
    name: string;
    text: string;
}

interface DataContextType {
    data: AssortmentItem[];
    plannerData: PlannerRow[];
    loading: boolean;
    loadData: () => Promise<void>;
    handleMultiUpload: (files: UploadedFile[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<AssortmentItem[]>([]);
    const [plannerData, setPlannerData] = useState<PlannerRow[]>([]);
    const [loading, setLoading] = useState(true);

    const saveToStorage = async (assortment: AssortmentItem[], planner: PlannerRow[]) => {
        try {
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.ASSORTMENT, JSON.stringify(assortment)],
                [STORAGE_KEYS.PLANNER, JSON.stringify(planner)],
            ]);
        } catch (e) {
            console.error('Failed to save data:', e);
        }
    };

    const loadFromStorage = async (): Promise<{ assortment: AssortmentItem[] | null; planner: PlannerRow[] | null }> => {
        try {
            const results = await AsyncStorage.multiGet([STORAGE_KEYS.ASSORTMENT, STORAGE_KEYS.PLANNER]);
            const assortment = results[0][1] ? JSON.parse(results[0][1]) : null;
            const planner = results[1][1] ? JSON.parse(results[1][1]) : null;
            return { assortment, planner };
        } catch (e) {
            console.error('Failed to load data:', e);
            return { assortment: null, planner: null };
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const stored = await loadFromStorage();

            if (stored.assortment && stored.assortment.length > 0) {
                setData(stored.assortment);
            } else {
                const result = await fetchAssortmentData();
                setData(result);
            }

            if (stored.planner && stored.planner.length > 0) {
                setPlannerData(stored.planner);
            } else {
                setPlannerData(fetchPlannerData());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMultiUpload = (files: UploadedFile[]) => {
        if (files.length === 1 && files[0].text === '__RESET__') {
            AsyncStorage.multiRemove([STORAGE_KEYS.ASSORTMENT, STORAGE_KEYS.PLANNER]).catch(() => { });
            loadData();
            Alert.alert('Success', 'Loaded Demo Data');
            return;
        }

        let newAssortment = data;
        let newPlanner = plannerData;
        let assortmentCount = 0;
        let plannerCount = 0;

        for (const file of files) {
            const firstLine = file.text.split('\n')[0].toLowerCase();
            if (firstLine.includes('planner name')) {
                const parsed = parsePlannerCSV(file.text);
                newPlanner = parsed;
                setPlannerData(parsed);
                plannerCount = parsed.length;
            } else {
                const parsed = parseCSV(file.text);
                newAssortment = parsed;
                setData(parsed);
                assortmentCount = parsed.length;
            }
        }

        saveToStorage(newAssortment, newPlanner);

        const parts: string[] = [];
        for (const file of files) {
            const firstLine = file.text.split('\n')[0].toLowerCase();
            const count = firstLine.includes('planner name') ? plannerCount : assortmentCount;
            parts.push(`${count} intersections of ${file.name}`);
        }
        Alert.alert('Loaded Successfully', parts.join('\n'));
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ data, plannerData, loading, loadData, handleMultiUpload }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
