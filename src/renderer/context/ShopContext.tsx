import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ShopSettings } from '../../shared/types';

interface ShopContextType {
    settings: ShopSettings | null;
    refreshSettings: () => Promise<void>;
    updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<ShopSettings | null>(null);

    const refreshSettings = async () => {
        try {
            const data = await window.api.settings.get();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const updateSettings = async (newSettings: Partial<ShopSettings>) => {
        try {
            await window.api.settings.update(newSettings);
            await refreshSettings();
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <ShopContext.Provider value={{ settings, refreshSettings, updateSettings }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
