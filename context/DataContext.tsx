import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAssortmentData, AssortmentItem, parseCSV } from '../services/dataService';
import { fetchPlannerData, parsePlannerCSV, PlannerRow } from '../services/plannerService';
import { Alert } from 'react-native';

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

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await fetchAssortmentData();
            setData(result);
            setPlannerData(fetchPlannerData());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMultiUpload = (files: UploadedFile[]) => {
        if (files.length === 1 && files[0].text === '__RESET__') {
            loadData();
            Alert.alert('Success', 'Loaded Demo Data');
            return;
        }

        let assortmentCount = 0;
        let plannerCount = 0;

        for (const file of files) {
            const firstLine = file.text.split('\n')[0].toLowerCase();
            if (firstLine.includes('planner name')) {
                const parsed = parsePlannerCSV(file.text);
                setPlannerData(parsed);
                plannerCount = parsed.length;
            } else {
                const parsed = parseCSV(file.text);
                setData(parsed);
                assortmentCount = parsed.length;
            }
        }

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
