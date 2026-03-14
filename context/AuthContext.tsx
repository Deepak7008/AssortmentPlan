import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    userName: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => void;
    loginWithGoogle: () => void;
    logout: () => void;
}

const AUTH_STORAGE_KEY = '@stratos_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const extractName = (email: string): string => {
    const local = email.split('@')[0];
    const name = local.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore auth state on mount
    useEffect(() => {
        const restoreAuth = async () => {
            try {
                const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                if (stored) {
                    const { email, name } = JSON.parse(stored);
                    setUserEmail(email);
                    setUserName(name);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                // Silently fail — user will just see login
            } finally {
                setIsLoading(false);
            }
        };
        restoreAuth();
    }, []);

    const login = async (email: string, _password: string) => {
        const name = extractName(email);
        setUserEmail(email);
        setUserName(name);
        setIsAuthenticated(true);
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, name }));
        } catch (e) {
            // Storage write failed — login still works in memory
        }
    };

    const loginWithGoogle = async () => {
        const email = 'user@gmail.com';
        const name = 'User';
        setUserEmail(email);
        setUserName(name);
        setIsAuthenticated(true);
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, name }));
        } catch (e) {
            // Storage write failed
        }
    };

    const logout = async () => {
        setUserEmail(null);
        setUserName(null);
        setIsAuthenticated(false);
        try {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (e) {
            // Storage removal failed
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, userName, isLoading, login, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
