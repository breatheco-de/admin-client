import React from 'react';
import queryString from 'query-string';
import moment from 'moment';
import store from '../store';
import { eventTypes } from '../views/forms/EventForm.js';

export const functions =  {
    student: (entity, extraSearch={}) => {
        if(typeof entity == 'undefined') return false;

        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(token == 'null') continue;
            if(key=='cohort') valid = entity.cohorts.indexOf(token) !== -1;
            else if(key=='name') valid = (entity.first_name.toLowerCase().search(token) !== -1 || entity.last_name.toLowerCase().search(token) !== -1);
            else if(key=='email') valid = entity.email.toLowerCase().search(token) !== -1;

            if(key=='status' && entity.status !== null && entity.status!= 'null' && entity.status != token) return false;

            if(key=='seeking_job' && entity.seeking_job !== null && entity.seeking_job!= 'null' && entity.seeking_job != token) return false;

            if(key=='financial_status' && entity.financial_status !== null && entity.financial_status!= 'null' && entity.financial_status != token) return false;

            if(key=='found_job' && entity.found_job !== null && entity.found_job!= 'null' && entity.found_job != token) return false;

        }
        if(valid &&  typeof extraSearch.query == 'string'){
            let nameMatches = (entity.first_name.toLowerCase().search(extraSearch.query) !== -1 ) || (entity.last_name && entity.last_name.toLowerCase().search(extraSearch.query) !== -1 );
            let emailMatches = (entity.email.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches || emailMatches) valid = true;
            else valid = false;
        }

        return valid;
    },
    user: (entity, extraSearch={}) => {
        if(typeof entity == 'undefined') return false;
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(token == 'null') continue;

            const full_name = entity.full_name ? entity.full_name : entity.first_name + ' ' + entity.last_name;
            if(key=='name') valid = (full_name.toLowerCase().search(token) !== -1 );
            else if(key=='email') valid = (entity.username.toLowerCase().search(token) !== -1 );

            else if(key=='type' && token && token!='null' && entity.type !== null && entity.type != token ) return false;
        }
        if(valid && typeof extraSearch.query == 'string'){
            const full_name = entity.full_name ? entity.full_name : entity.first_name + ' ' + entity.last_name;
            let nameMatches = (full_name.toLowerCase().search(extraSearch.query) !== -1 );
            let emailMatches = (entity.username.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches || emailMatches) valid = true;
            else valid = false;
        }

        return valid;
    },
    cohort: (entity, extraSearch={}) => {
        if(typeof entity == 'undefined') return false;
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(token == 'null') continue;
            if(key=='name') valid = (entity.name.toLowerCase().search(token) !== -1 );
            else if(key=='profile') valid = (entity.profile_slug.toLowerCase().search(token) !== -1 );

            if(key=='stage' && entity.stage !== null && entity.stage!= 'null' && entity.stage != token) return false;

            if(key=='location' && entity.location_id !== null && entity.location_id!= 'null' && entity.location_id != token) return false;

            if(key=='kickoff_date' && entity.kickoff_date){
                if(token=='before-today' && moment(entity.kickoff_date).isAfter(moment())) return false;
                if(token=='after-today' && moment(entity.kickoff_date).isBefore(moment())) return false;
            }
        }
        if(valid &&  typeof extraSearch.query == 'string'){
            let nameMatches = (entity.name.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches) valid = true;
            else valid = false;
        }

        return valid;
    },
    event: (entity, extraSearch={}) => {
        if(typeof entity == 'undefined') return false;
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(token == 'null') continue;
            if(key=='name') valid = (entity.title.toLowerCase().search(token) !== -1 );

            if(key=='status' && token && token!='null' && entity.status !== null && entity.status.toLowerCase().search(token) == -1 ) return false;

            if(key=='date_status' && token && token!='null' ){
                const eventDate = moment(entity.event_date);
                if(token == 'upcoming' && moment().isAfter(eventDate)) return false;
                if(token == 'past' && moment().isBefore(eventDate)) return false;
            }

            if(key=='recurrent_type' && token && token!='null' && entity.recurrent_type && entity.recurrent_type != token ) return false;
            if(key=='type' && token && token!='null' && entity.type && entity.type != token ) return false;
            if(key=='city_slug' && token && token!='null' && entity.city_slug && entity.city_slug != token ) return false;
        }
        if(valid && typeof extraSearch.query == 'string'){
            let nameMatches = (entity.title.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches) valid = true;
            else valid = false;
        }

        return valid;
    }
};

export const Filter = ({ history, type }) => {
    const searchParams = queryString.parse(window.location.search);

    return (<div className="manage-filters">
            {(type=='event') ?
                <span>
                    <select
                        value={searchParams['date_status']}
                        onChange={(e) => {
                            searchParams['date_status'] = e.target.value;
                            history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                        }}
                    >
                        <option value="null">filter by date</option>
                        <option value="upcoming">upcoming</option>
                        <option value="past">past</option>
                    </select>
                    <select
                        value={searchParams['status']}
                        onChange={(e) => {
                            searchParams['status'] = e.target.value;
                            history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                        }}
                    >
                        <option value="null">filter by status</option>
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                    </select>
                    <select
                        value={searchParams['city_slug']}
                        onChange={(e) => {
                            searchParams['city_slug'] = e.target.value;
                            history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                        }}
                    >
                        <option value="null">filter by city</option>
                        <option value={'miami'}>Miami</option>
                        <option value={'maracaibo'}>Maracaibo</option>
                        <option value={'santiago'}>Santiago de Chile</option>
                        <option value={'bogota'}>Bogota</option>
                        <option value={'jacksonville'}>Jacksonville</option>
                    </select>
                    <select
                        value={searchParams['type']}
                        onChange={(e) => {
                            searchParams['type'] = e.target.value;
                            history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                        }}
                    >
                        <option value="null">filter by type</option>
                        {eventTypes.map((t,i) => (<option key={i} value={t}>{t}</option>))}
                    </select>
                    <select
                        value={searchParams['recurrent_type']}
                        onChange={(e) => {
                            searchParams['recurrent_type'] = e.target.value;
                            history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                        }}
                    >
                        <option value="null">filter by recurrency type</option>
                        <option value="one_time">One Time</option>
                        <option value="every_week">Every Week</option>
                    </select>
                </span>
            :(type=='student') ? (<span>
                <select
                    value={searchParams['status']}
                    onChange={(e) => {
                        searchParams['status'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">filter by status</option>
                    { store.getCatalog('student_status').map((c,i) => (<option key={i} value={c.value}>{c.label}</option>)) }
                </select>
                <select
                    value={searchParams['seeking_job']}
                    onChange={(e) => {
                        searchParams['seeking_job'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">Seeking Job</option>
                    <option value="1">yes</option>
                    <option value="0">no</option>
                </select>
                <select
                    value={searchParams['found_job']}
                    onChange={(e) => {
                        searchParams['found_job'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">Has Found Job</option>
                    <option value="1">yes</option>
                    <option value="0">no</option>
                </select>
                <select
                    value={searchParams['financial_status']}
                    onChange={(e) => {
                        searchParams['financial_status'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">Finantial Status</option>
                    { store.getCatalog('finantial_status').map((c,i) => (<option key={i} value={c.value}>{c.label}</option>)) }
                </select>
                <select
                    value={searchParams['cohort']}
                    onChange={(e) => {
                        searchParams['cohort'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                     <option value="null">filter by cohort</option>
                    { store.getAll('cohort').map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>)) }
                </select>
            </span>)
            :(type=='cohort') ? (<span>
                <select
                    value={searchParams['kickoff_date']}
                    onChange={(e) => {
                        searchParams['kickoff_date'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">Starting Date</option>
                    <option value="after-today">After Today</option>
                    <option value="before-today">Before Today</option>
                </select>
                <select
                    value={searchParams['stage']}
                    onChange={(e) => {
                        searchParams['stage'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">filter by stage</option>
                    { store.getCatalog('cohort_stages').map((c,i) => (<option key={i} value={c.value}>{c.label}</option>)) }
                </select>
                <select
                    value={searchParams['profile']}
                    onChange={(e) => {
                        searchParams['profile'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                     <option value="null">filter by profile</option>
                    { store.getAll('profile').map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>)) }
                </select>
                <select
                    value={searchParams['location']}
                    onChange={(e) => {
                        searchParams['location'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                     <option value="null">filter by location</option>
                    { store.getAll('location').map((l,i) => (<option key={i} value={l.id}>{l.name}</option>)) }
                </select>
            </span>)
            :(type=='user') ? (<span>
                <select
                    value={searchParams['type']}
                    onChange={(e) => {
                        searchParams['type'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">filter by role</option>
                    { store.getCatalog('user_types').map((l,i) => (<option key={i} value={l.value}>{l.label}</option>)) }
                </select>
            </span>)
            :''
            }
            <button className="btn" onClick={() => history.push('/manage/'+type)}>clear filters</button>
        </div>);
};