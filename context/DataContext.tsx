import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAssortmentData, AssortmentItem, parseCSV } from '../services/dataService';
import { Alert } from 'react-native';

interface DataContextType {
    data: AssortmentItem[];
    loading: boolean;
    loadData: () => Promise<void>;
    handleCSVUpload: (csvText: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<AssortmentItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await fetchAssortmentData();
            setData(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = (csvText: string) => {
        if (csvText === '__RESET__') {
            loadData();
            Alert.alert('Success', 'Loaded Demo Data');
            return;
        }
        try {
            const parsedData = parseCSV(csvText);
            setData(parsedData);
            Alert.alert('Success', `Loaded ${parsedData.length} items from CSV`);
        } catch (error) {
            Alert.alert('Error', 'Failed to parse CSV file');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ data, loading, loadData, handleCSVUpload }}>
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
