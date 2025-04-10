import React from 'react';

interface ItemType {
    id: number;
    value: string;
    packed: boolean;
    onCheckOff: () => void;
}

const Item: React.FC<ItemType> = ({ packed, id, value, onCheckOff }) => {
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