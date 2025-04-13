// TypeScript declarations for Electron Forge Webpack
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

import { ItemType } from './components/Item';

export interface ElectronAPI {
    database: {
    fetchItems: () => Promise<ItemType[]>;
    addItem: (item: ItemType) => Promise<ItemType>;
    updateItem: (item: { id: number; value: string; packed: boolean }) => Promise<Boolean>;
    deleteItem: (id: number) => Promise<Boolean>;
    markAsPacked: (id: number) => Promise<Boolean>;
    markAllAsUnpacked: () => Promise<Boolean>;
    deleteUnpackedItems: () => Promise<Boolean>;
    };
}

export const s = "string";

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}