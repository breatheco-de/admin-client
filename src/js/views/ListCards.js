import React from "react";
import { DropLink } from '../utils/bc-components/index';

const dropdownOptions = [
    { label: 'edit', slug: 'edit' },
    { label: 'delete', slug: 'delete' }
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
    ),
    studentCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
            dropdown={[
                { 
                    label: 'internal profile', 
                    slug: 'internal_profile', 
                    to: `/internal_profile/student/${data.id}`
                }
            ].concat(dropdownOptions)}
            onSelect={(opt) => onEntitySelect(opt, data)}>
            {data.full_name}, {data.email} 
            </DropLink>
        </li>
    ),
    cohortCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
            dropdown={dropdownOptions.concat([
                { 
                    label: 'review students', 
                    slug: 'cohort_students', 
                    to: `/manage/student/?cohort=${data.slug}`
                }
            ])}
            onSelect={(opt) => onEntitySelect(opt, data)}>
            {data.name} <small className="text-info">{data.profile_slug}</small>
            </DropLink>
        </li>
    )
};
export default cards;