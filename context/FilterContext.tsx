import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedClass: string;
    setSelectedClass: (value: string) => void;
    selectedSeason: string;
    setSelectedSeason: (value: string) => void;
    selectedBizLocation: string;
    setSelectedBizLocation: (value: string) => void;
    selectedCountry: string;
    setSelectedCountry: (value: string) => void;
    resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedSeason, setSelectedSeason] = useState('All');
    const [selectedBizLocation, setSelectedBizLocation] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');

    const resetFilters = () => {
        setSelectedCategory('All');
        setSelectedClass('All');
        setSelectedSeason('All');
        setSelectedBizLocation('All');
        setSelectedCountry('All');
    };

    return (
        <FilterContext.Provider value={{
            selectedCategory, setSelectedCategory,
            selectedClass, setSelectedClass,
            selectedSeason, setSelectedSeason,
            selectedBizLocation, setSelectedBizLocation,
            selectedCountry, setSelectedCountry,
            resetFilters,
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};
