import React from "react";
import { DropLink } from '../utils/bc-components/index';

const dropdownOptions = [
    { label: 'edit', slug: 'edit' },
    { label: 'delete (from breathecode only)', slug: 'delete' }
];

let cards = {
    userCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
            dropdown={dropdownOptions}
            onSelect={(opt) => onEntitySelect(opt, data)}>
            {data.full_name}, {data.email} 
            </DropLink>
        </li>
    ),
    studentCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
                className='studentCard'
                dropdown={[
                    // { 
                    //     label: 'internal profile', 
                    //     slug: 'internal_profile', 
                    //     to: `/internal_profile/student/${data.id}`
                    // }
                ].concat(dropdownOptions)}
                onSelect={(opt) => onEntitySelect(opt, data)}>
                    <h5 className="m-0">{data.full_name}</h5>
                    <p className='subrow'>
                        <small className="text-info">{data.email}</small>
                        <small className="ml-4 text-secondary">{data.phone}</small>
                        <small className="ml-4 text-success">{data.github}</small>
                    </p>
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