import { NewRentalData, ShopSettings, Item, Rental, RentalItemWithDetails } from '../shared/types';

export interface Api {
    items: {
        getAll: () => Promise<Item[]>;
        create: (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Item>;
        search: (query: string) => Promise<Item[]>;
        delete: (id: string) => Promise<boolean>;
    };
    rentals: {
        create: (data: NewRentalData) => Promise<string>;
        getOngoing: () => Promise<Rental[]>;
        markReturned: (id: string, returnDate: number) => Promise<boolean>;
    };
    renters: {
        search: (query: string) => Promise<Rental[]>;
    };
    settings: {
        get: () => Promise<ShopSettings>;
        update: (data: Partial<ShopSettings>) => Promise<boolean>;
    };
    data: {
        export: () => Promise<boolean>;
        import: (mode: 'add' | 'overwrite') => Promise<{ success: boolean; message: string }>;
    };
}

declare global {
    interface Window {
        api: Api;
    }
}
