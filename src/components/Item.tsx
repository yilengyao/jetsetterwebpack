import React from 'react';

export interface ItemType {
    id: number;
    value: string;
    packed: boolean;
}

// Define props interface
interface ItemProp extends ItemType {
    onCheckOff: () => void;
}

const Item: React.FC<ItemProp> = ({ packed, id, value, onCheckOff }) => {
    return (
        <article className="item">
            <label>
                <input type="checkbox" checked={packed} onChange={onCheckOff} />
                {value}
            </label>
        </article>
    );
};

export default Item;