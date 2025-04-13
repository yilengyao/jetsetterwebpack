// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { ItemType } from './components/Item';

console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    database: {
        fetchItems: () => { 
            return ipcRenderer.invoke('database:fetch-items');
        },
        addItem: (item: ItemType) => {
            console.log("item in preload: ", item);
            return ipcRenderer.invoke('database:add-item', item);
        },
        deleteItem: (id: number) => {
            return ipcRenderer.invoke('database:delete-item', id);
        },
        markAsPacked: (id: number) => {
            return ipcRenderer.invoke('database:mark-as-packed', id);
        },
        markAllAsUnpacked: () => {
            return ipcRenderer.invoke('database:mark-all-as-unpacked');
        },
        deleteUnpackedItems: () => {
            return ipcRenderer.invoke('database:delete-unpacked-items');
        }
    }
});

export const s = "string";