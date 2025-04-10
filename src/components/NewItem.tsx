import React, { useState, FormEvent, ChangeEvent } from 'react';

// Define the item type
interface ItemType {
    id: number;
    value: string;
    packed: boolean;
}

// Define props interface
interface NewItemProps {
    onSubmit: (item: ItemType) => void;
}

const NewItem: React.FC<NewItemProps> = ({ onSubmit = (item: ItemType) => {} }) => {
    const [value, setValue] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ value, packed: false, id: Date.now() });
        setValue('');
    }

    return (
        <form className="NewItem" onSubmit={handleSubmit}>
            <input 
                className="NewItem-input" 
                type="text" 
                value={value} 
                onChange={handleChange} 
            />
            <input 
                className="NewItem-submit button" 
                type="submit" 
            />
        </form>
    );
};

export default NewItem;