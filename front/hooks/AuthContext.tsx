// hooks/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    token: string | null;
    loading: boolean;
    saveToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('userToken')
            .then(setToken)
            .finally(() => setLoading(false));
    }, []);

    const saveToken = async (newToken: string) => {
        await AsyncStorage.setItem('userToken', newToken);
        setToken(newToken);
    };

    const clearToken = async () => {
        await AsyncStorage.removeItem('userToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, loading, saveToken, clearToken }}>
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
