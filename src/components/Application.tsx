import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import Items from './Items';

export interface Item {
    id: number;
    value: string;
    packed: boolean;
}

const Application: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        window.electronAPI.database.fetchItems()
            .then((items: Item[]) => {
                setItems(items);
            });
    }, []);

    const addItem = (item: Item) => {    
        window.electronAPI.database.addItem(item);
        window.electronAPI.database.fetchItems()
            .then((items: Item[]) => {
                setItems(items);
            });
    }

    const markAsPacked = (item: Item) => {
        window.electronAPI.database.markAsPacked(item.id);
        window.electronAPI.database.fetchItems()
            .then((items: Item[]) => {
                setItems(items);
            });
    }

    const markAllAsUnpacked = () => {
        window.electronAPI.database.markAllAsUnpacked();
        window.electronAPI.database.fetchItems()
            .then((items: Item[]) => {
                setItems(items);
            });
    }

    const deleteItem = (item: Item) => {
        window.electronAPI.database.deleteItem(item.id);
        window.electronAPI.database.fetchItems()
            .then((items: Item[]) => {
                setItems(items);
            });
    }

    const deleteUnpackedItems = () => {
        window.electronAPI.database.deleteUnpackedItems();
        window.electronAPI.database.fetchItems()
            .then((items: Item[]) => {
                setItems(items);
            });
    }

    const unpackedItems = items ? items.filter(item => !item.packed) : [];
    const packedItems = items ? items.filter(item => item.packed) : [];

    return (
        <div className="Application">
            <NewItem onSubmit={addItem} />
            <Items
                title="Unpacked Items"
                items={unpackedItems}
                onCheckOff={markAsPacked}
                onDelete={deleteItem}
            />
            <Items
                title="Packed Items"
                items={packedItems}
                onCheckOff={markAsPacked}
                onDelete={deleteItem}
            />
            <button 
                className="button fullWidth"
                onClick={markAllAsUnpacked}
            >
                Mark All As Unpacked
            </button>
            <button 
                className="button fullWidth"
                onClick={deleteUnpackedItems}
            >
                Delete Unpacked Items
            </button>
        </div>
    )
        
}

export default Application;