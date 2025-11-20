import { contextBridge, ipcRenderer } from 'electron';
import type { NewRentalData, ShopSettings } from '../shared/types';

contextBridge.exposeInMainWorld('api', {
    // Items
    items: {
        getAll: () => ipcRenderer.invoke('items:getAll'),
        create: (data: any) => ipcRenderer.invoke('items:create', data),
        update: (data: any) => ipcRenderer.invoke('items:update', data),
        search: (query: string) => ipcRenderer.invoke('items:search', query),
        delete: (id: string) => ipcRenderer.invoke('items:delete', id),
    },

    // Rentals
    rentals: {
        create: (data: NewRentalData) => ipcRenderer.invoke('rentals:create', data),
        getOngoing: () => ipcRenderer.invoke('rentals:getOngoing'),
        markReturned: (id: string, returnDate: number) => ipcRenderer.invoke('rentals:markReturned', { id, returnDate }),
    },

    // Renters
    renters: {
        search: (query: string) => ipcRenderer.invoke('renters:search', query),
    },

    // Settings
    settings: {
        get: () => ipcRenderer.invoke('settings:get'),
        update: (data: Partial<ShopSettings>) => ipcRenderer.invoke('settings:update', data),
    },

    // Data
    data: {
        export: () => ipcRenderer.invoke('data:export'),
        import: (mode: 'add' | 'overwrite') => ipcRenderer.invoke('data:import', mode),
    },
});
