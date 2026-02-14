import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
    selectedClass: string;
    setSelectedClass: (value: string) => void;
    selectedCountry: string;
    setSelectedCountry: (value: string) => void;
    selectedSeason: string;
    setSelectedSeason: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedSeason, setSelectedSeason] = useState('All');

    return (
        <FilterContext.Provider value={{
            selectedClass, setSelectedClass,
            selectedCountry, setSelectedCountry,
            selectedSeason, setSelectedSeason,
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
