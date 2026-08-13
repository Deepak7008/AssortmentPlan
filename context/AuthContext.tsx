import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    userName: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => void;
    loginWithGoogle: () => void;
    logout: () => void;
}

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
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, _password: string) => {
        const name = extractName(email);
        setUserEmail(email);
        setUserName(name);
        setIsAuthenticated(true);
    };

    const loginWithGoogle = async () => {
        const email = 'user@gmail.com';
        const name = 'User';
        setUserEmail(email);
        setUserName(name);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        setUserEmail(null);
        setUserName(null);
        setIsAuthenticated(false);
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
