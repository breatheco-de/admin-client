import React from "react";
import { DropLink } from '..//utils/react-components/src/index';
import * as AdminActions from '../actions/AdminActions';
import moment from 'moment';

const dropdownOptions = [
    { label: 'Details', slug: 'edit', icon: 'fas fa-pencil-alt' },
    { label: 'Delete (from breathecode only)', slug: 'delete', icon: 'fas fa-trash' }
];

export function cardActions(opt, ent){

        if(typeof opt.to === 'string') this.props.history.push(opt.to);
        else{
            switch(opt.slug){
                case "edit":
                    this.props.history.push(`/manage/${this.state.entitySlug}/${ent.id}/edit`);
                break;
                case "delete":
                    AdminActions.remove(this.state.entitySlug, ent);
                break;
                case "open_in_new_window":
                    window.open(opt.url, '_blank');
                break;
                case "change_event_status":
                    AdminActions.update(this.state.entitySlug, {
                        id: opt.event_id,
                        status: opt.new_status
                    });
                break;
                case "hook":
                    AdminActions.hook(opt.data.slug, opt.data.data);
                break;
                default:
                    if(typeof AdminActions.custom[this.state.entitySlug][opt.slug] === 'undefined')
                        throw new Error(`Undefined custom action ${this.state.entitySlug}.${opt.slug}()`);
                    else AdminActions.custom[this.state.entitySlug][opt.slug](opt.data);
                break;
            }
        }
    };

export const cards = {
    userCard: (data, onEntitySelect, children = null) => (
        <li key={data.id}>
            <DropLink
                className='list_card'
                dropdown={dropdownOptions}
                onSelect={(opt) => onEntitySelect(opt, data)}
            >
                { children ? children :
                    <div>
                        {data.full_name ? data.full_name : data.first_name + ' ' + data.last_name}
                        <p className='subrow'>
                            <small className="text-info">{data.type}</small>
                            <small className="ml-4 text-secondary">{data.username}</small>
                        </p>
                    </div>
                }
            </DropLink>
        </li>
    ),
    studentCard: (data, onEntitySelect, children = null) => (
        <li key={data.id}>
            <DropLink
                className='list_card'
                dropdown={[
                    {
                        label: 'Recent Activity',
                        icon: 'fas fa-calendar-check',
                        to: '/student/i/activity/?user='+data.id
                    },
                    {
                        label: 'Change BreatheCode Status',
                        icon: 'fas fa-graduation-cap',
                        slug: 'change_breathecode_status',
                        data: { student: data }
                    },
                    {
                        label: 'Change Job Status',
                        icon: 'fas fa-suitcase',
                        slug: 'change_hired_status',
                        data: { student: data }
                    },
                    {
                        label: 'Change Finantial Status',
                        icon: 'fas fa-dollar-sign',
                        slug: 'change_finantial_status',
                        data: { student: data }
                    },
                    {
                        label: 'review assignments',
                        icon: 'fas fa-tasks',
                        slug: 'student_assignments',
                        to: '/manage/student/'+data.id+'/assignments'
                    },
                    {
                        label: 'Convert to teacher',
                        icon: 'fas fa-exchange-alt',
                        slug: 'convert_to_teacher',
                        data: { student: data }
                    },
                    {
                        label: 'Sync With Active Campaign',
                        icon: 'fas fa-exchange-alt',
                        slug: 'hook',
                        data: { slug: '/sync/contact' , data }
                    }
                ].concat(dropdownOptions)}
                onSelect={(opt) => onEntitySelect(opt, data)}>
                { children ? children :
                    <div>
                    <h5 className="m-0">
                        {data.first_name + " " + data.last_name}
                        { (data.status === 'studies_finished' && data.seeking_job == 1 && data.found_job == 0) ?
                            <span className="ml-2 text-danger"><i className="fas fa-ban"></i> NOT HIRED YET</span>
                            : (data.status === 'studies_finished' && data.seeking_job == 1 && data.found_job == 1) ?
                                <span className="ml-2 text-success"><i className="fas fa-suitcase"></i> HIRED</span>
                                : ''
                        }
                    </h5>
                    <p className='subrow'>
                        <small className="text-info">{data.email}</small>
                        <small className="ml-4 text-secondary">{data.phone}</small>
                        <small className="ml-4 text-success">{data.github}</small>
                        <small className={"ml-4 text-"+((data.status=='blocked' || data.status=='student_dropped') ? "danger":"secondary")}>{data.status}</small>
                    </p>
                    </div>
                }
            </DropLink>
        </li>
    ),
    cohortCard: (data, onEntitySelect, children = null) => (
        <li key={data.id}>
            <DropLink
            className='list_card'
            dropdown={dropdownOptions.concat([
                {
                    label: 'review students',
                    slug: 'cohort_students',
                    icon: 'fas fa-user-graduate',
                    to: '/manage/student/?cohort='+data.slug
                },
                {
                    label: 'change cohort stage',
                    slug: 'change_stage',
                    icon: 'fas fa-exchange-alt',
                    data: { cohort: data } //
                },
                {
                    label: 'review assignments',
                    icon: 'fas fa-tasks',
                    slug: 'cohort_assignments',
                    to: '/manage/cohort/'+data.id+'/assignments'
                },
            ])}
            onSelect={(opt) => onEntitySelect(opt, data)}>
                { children ? children :
                    <div>
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
                                    (moment(data.kickoff_date).isBefore(moment())) ?
                                        <small className="text-success"> (started)</small>
                                        :
                                        <small className="text-primary"> (upcoming)</small>
                                }
                            </small>
                            :
                            <small className="ml-4 text-danger">missing kickoff date</small>
                        }
                        { (data.ending_date && data.ending_date !== '' && data.ending_date !== '0000-00-00') ?
                            <small className="ml-4 text-secondary">
                                to: {data.ending_date}
                                {
                                    ((moment(data.ending_date).isAfter(moment()))) ?
                                        <small className="text-success"> (ongoing)</small>
                                        :
                                        <small className="text-primary"> (finished)</small>
                                }
                            </small>
                            :
                            <small className="ml-4 text-danger">missing ending_date</small>
                        }
                    </p>
                </div>
                }
            </DropLink>
        </li>
    ),
    locationCard: (data, onEntitySelect, children = null) => (
        <li key={data.id}>
            <DropLink
            className='list_card'
            dropdown={dropdownOptions.concat([
                {
                    label: 'review cohorts',
                    slug: 'cohort_students',
                    to: '/manage/cohort/?location='+data.slug
                }
            ])}
            onSelect={(opt) => onEntitySelect(opt, data)}>
                { children ? children :
                    <div>
                        {data.name}
                        <p className='subrow'>
                            <small className="mr-1 text-info">{data.country}</small>
                            {
                                <small className={(data.stage === 'not-started') ? 'text-success' : 'text-secondary'}> {data.lang}</small>
                            }
                        </p>
                    </div>
                }
            </DropLink>
        </li>
    ),
    profileCard: (data, onEntitySelect, children = null) => (
        <li key={data.id}>
            <DropLink
                className='list_card'
                dropdown={dropdownOptions}
                onSelect={(opt) => onEntitySelect(opt, data)}
            >
                { children ? children :
                    <div>
                        {data.name}
                        <p className='subrow'>
                            <small className="text-info">{data.description}</small>
                        </p>
                    </div>
                }
            </DropLink>
        </li>
    ),
    eventCard: (data, onEntitySelect, children = null) => (
        <li key={data.id}>
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
                { children ? children :
                    <div>
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
                            <small className="ml-4">
                                On: {(typeof data.event_date == 'string') ? data.event_date.substr(0,10) : 'no upcoming date'}
                                { (data.recurrent_type && data.recurrent_type != "one_time") ?
                                    <span className="text-primary"> ({data.recurrent_type})</span>
                                    :
                                    (data.hasPassed) ?
                                        <span className="text-dark"> (already passed)</span>
                                    :
                                        <span className="text-success"> (upcoming)</span>
                                }
                            </small>
                        </p>
                    </div>
                }
            </DropLink>
        </li>
    )
};