import React from "react";
import { DropLink } from '..//utils/react-components/src/index';

const dropdownOptions = [
    { label: 'Edit', slug: 'edit' },
    { label: 'Delete (from breathecode only)', slug: 'delete', icon: 'trash' }
];
let cards = {
    userCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
                className='list_card'
                dropdown={dropdownOptions}
                onSelect={(opt) => onEntitySelect(opt, data)}
            >
                {data.full_name}
                <p className='subrow'>
                    <small className="text-info">{data.type}</small>
                    <small className="ml-4 text-secondary">{data.username}</small>
                </p>
            </DropLink>
        </li>
    ),
    studentCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
                className='list_card'
                dropdown={[
                    { 
                        label: 'Recent Activity', 
                        to: '/student/i/activity/?user='+data.id
                    },
                    { 
                        label: 'Change BreatheCode Status', 
                        slug: 'change_breathecode_status',
                        data: { student: data }
                    }
                ].concat(dropdownOptions)}
                onSelect={(opt) => onEntitySelect(opt, data)}>
                    <h5 className="m-0">{data.full_name}</h5>
                    <p className='subrow'>
                        <small className="text-info">{data.email}</small>
                        <small className="ml-4 text-secondary">{data.phone}</small>
                        <small className="ml-4 text-success">{data.github}</small>
                        <small className={"ml-4 text-"+((data.status=='blocked' || data.status=='student_dropped') ? "danger":"secondary")}>{data.status}</small>
                    </p>
            </DropLink>
        </li>
    ),
    cohortCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
            className='list_card'
            dropdown={dropdownOptions.concat([
                { 
                    label: 'review students', 
                    slug: 'cohort_students', 
                    to: '/manage/student/?cohort='+data.slug
                },
                { 
                    label: 'change cohort stage', 
                    slug: 'change_stage',
                    data: { cohort: data } //
                }
            ])}
            onSelect={(opt) => onEntitySelect(opt, data)}>
            {data.name}
            <h5 className="m-0">{data.full_name}</h5>
            <p className='subrow'>
                <small className="mr-1 text-info">{data.profile_slug}</small>
                { 
                    <small className={(data.stage === 'not-started') ? 'text-success' : 'text-secondary'}> {data.stage}</small>
                }
                { (data.kickoff_date && data.kickoff_date !== '' && data.kickoff_date !== '0000-00-00') ? 
                    <small className="ml-4 text-secondary">
                        Start: {data.kickoff_date}
                        { 
                            ((new Date(data.kickoff_date).getTime()) <= (new Date()).getTime()) ?
                                <small className="text-success"> (started)</small>
                                :
                                <small className="text-primary"> (upcoming)</small>
                        }
                    </small>
                    :
                    <small className="ml-4 text-danger">missing kickoff date</small>
                }
            </p>
            </DropLink>
        </li>
    ),
    profileCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
                className='list_card'
                dropdown={dropdownOptions}
                onSelect={(opt) => onEntitySelect(opt, data)}
            >
                {data.name}
                <p className='subrow'>
                    <small className="text-info">{data.description}</small>
                </p>
            </DropLink>
        </li>
    ),
    eventCard: (data, key, onEntitySelect) => (
        <li key={key}>
            <DropLink
                className='list_card'
                dropdown={[
                    { 
                        label: 'Got To Landing', 
                        slug: 'open_in_new_window', 
                        url: data.url
                    },
                    { 
                        label: 'Duplicate Event', 
                        slug: 'duplicate_event', 
                        data: { event: data }
                    }
                ].concat((() => {
                    let statusActions = [];
                    if(data.status !== 'published') statusActions.push({
                        label: 'Publish Event', 
                        slug: 'change_event_status',
                        event_id: data.id,
                        new_status: 'published'
                    });
                    if(data.status === 'published') statusActions.push({
                        label: 'Unpublish the event (make it a draft again)', 
                        slug: 'change_event_status',
                        event_id: data.id,
                        new_status: 'draft'
                    });
                    return statusActions;
                })()).concat(dropdownOptions)}
                onSelect={(opt) => onEntitySelect(opt, data)}
            >
                {data.title}
                <p className='subrow'>
                    <small className="text-secondary">{data.city}:</small>
                    <small className="text-info">{data.type}</small>
                    {
                        (data.status == 'published') ?
                            <small className="ml-4 text-success">{data.status}</small>
                        : (data.status == 'draft') ?
                            <small className="ml-4 text-danger">{data.status}</small>
                        :
                            <small className="ml-4 text-secondary">{data.status}</small>
                    }
                    <small className="ml-4 text-warning">
                        On: {data.event_date.substr(0,10)}
                        { (data.hasPassed) ? 
                                <span className="text-black"> (passed)</span> 
                            : 
                                <span className="text-success"> (upcoming)</span> 
                        }
                    </small>
                </p>
            </DropLink>
        </li>
    )
};
export default cards;