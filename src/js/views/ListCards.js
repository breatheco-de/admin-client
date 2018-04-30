import React from "react";
import { DropLink } from '../utils/bc-components/index';

const dropdownOptions = [
    { label: 'edit', slug: 'edit' }
];

let cards = {
    userCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
            dropdown={dropdownOptions}
            onSelect={(opt) => onEntitySelect(opt, data)}>
            {data.full_name}, {data.username} 
            </DropLink>
        </li>
    )
};
export default cards;