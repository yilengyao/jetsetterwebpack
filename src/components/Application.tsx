import React, { useState } from 'react';
import NewItem from './NewItem';
import Items from './Items';

export interface Item {
    id: number;
    value: string;
    packed: boolean;
}

const Application: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
        { value: 'Pants', id: Date.now(), packed: false}
    ]);

    const addItem = (item: Item) => {
        setItems([...items, item]);
    }

    const markAsPacked = (item: Item) => {
        const otherItems = items.filter(i => i.id !== item.id);
        const updatedItem = { ...item, packed: !item.packed };
        setItems([...otherItems, updatedItem]);
    }

    const markAllAsUnpacked = () => {
        const markedItems = items.map(item => ({ ...item, packed: false }));
        setItems(markedItems);
    }

    const unpackedItems = items.filter(item => !item.packed);
    const packedItems = items.filter(item => item.packed);

    return (
        <div className="Application">
            <NewItem onSubmit={addItem} />
            <Items
                title="Unpacked Items"
                items={unpackedItems}
                onCheckOff={markAsPacked}
            />
            <Items
                title="Packed Items"
                items={packedItems}
                onCheckOff={markAsPacked}
            />
            <button 
                className="button fullWidth"
                onClick={markAllAsUnpacked}
            >
                Mark All As Unpacked
            </button>
        </div>
    )
        
}

export default Application;