import React from 'react';
import Item from './Item';

// Define the structure of an item
interface ItemType {
    id: number;
    value: string;
    packed: boolean;
}

// Define the props interface'
interface ItemsProps {
    title: string;
    items: ItemType[];
    onCheckOff: (item: ItemType) => void;
    onDelete: (item: ItemType) => void;
}

// Use the interface to type the props, then destructure them
const Items: React.FC<ItemsProps> = ({ title, items, onCheckOff, onDelete }) => {
    return (
        <section className="Items">
            <h2>{ title }</h2>
            {items.map(item => (
                <Item
                    key={item.id}
                    onCheckOff={() => onCheckOff(item)}
                    onDelete={() => onDelete(item)}
                    {...item}
                />
            ))}
        </section>
    );
};

export default Items;