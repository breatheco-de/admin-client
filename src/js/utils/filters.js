import React from 'react';
import queryString from 'query-string';

export const functions =  {
    student: (entity, extraSearch={}) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='cohort') valid = entity.cohorts.indexOf(token) !== -1;
            else if(key=='name') valid = entity.full_name.toLowerCase().search(token) !== -1;
            else if(key=='email') valid = entity.email.toLowerCase().search(token) !== -1;
            
            if(key=='status' && entity.status && entity.status!= 'null' && entity.status != token) return false;
            
        }
        if(valid &&  typeof extraSearch.query == 'string'){
            let nameMatches = (entity.full_name.toLowerCase().search(extraSearch.query) !== -1 );
            let emailMatches = (entity.email.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches || emailMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    },
    user: (entity, extraSearch={}) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='name') valid = (entity.full_name.toLowerCase().search(token) !== -1 );
            else if(key=='email') valid = (entity.username.toLowerCase().search(token) !== -1 );
        }
        if(valid && typeof extraSearch.query == 'string'){
            let nameMatches = (entity.full_name.toLowerCase().search(extraSearch.query) !== -1 );
            let emailMatches = (entity.username.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches || emailMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    },
    cohort: (entity, extraSearch={}) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='name') valid = (entity.name.toLowerCase().search(token) !== -1 );
            else if(key=='profile') valid = (entity.profile_slug.toLowerCase().search(token) !== -1 );
            
            if(key=='stage' && entity.stage && entity.stage!= 'null' && entity.stage != token) return false;
            else if(key=='location_id' && entity.location_id && entity.location_id!= 'null' && entity.location_id != token) return false;
        }
        if(valid &&  typeof extraSearch.query == 'string'){
            let nameMatches = (entity.name.toLowerCase().search(extraSearch.query) !== -1 );
            if(nameMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    },
    event: (entity, extraSearch={}) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='name') valid = (entity.title.toLowerCase().search(token) !== -1 );
            
            if(key=='status' && token && token!='null' && entity.status.toLowerCase().search(token) == -1 ) return false;
            else if(key=='recurrent_type' && token && token!='null' && entity.recurrent_type && entity.recurrent_type != token ) return false;
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
                        value={searchParams['recurrent_type']}
                        onChange={(e) => {
                            searchParams['recurrent_type'] = e.target.value;
                            history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                        }}
                    >
                        <option value="null">filter by recurrency type</option>
                        <option value="one_time">one_time</option>
                        <option value="every_week">every_week</option>
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
                    <option value="under_review">under_review</option>
                    <option value="currently_active">currenty active</option>
                    <option value="studies_finished">studies finished</option>
                    <option value="student_dropped">student_dropped</option>
                    <option value="blocked">blocked</option>
                </select>
            </span>)
            :(type=='cohort') ? (<span>
                <select 
                    value={searchParams['stage']}
                    onChange={(e) => {
                        searchParams['stage'] = e.target.value;
                        history.push('/manage/'+type+'/?'+queryString.stringify(searchParams));
                    }}
                >
                    <option value="null">filter by stage</option>
                    <option value="not-started">not-started</option>
                    <option value="on-prework">on-prework</option>
                    <option value="on-course">on-course</option>
                    <option value="on-final-project">on-final-project</option>
                    <option value="finished">finished</option>
                </select>
            </span>)
            :''
            }
            <button className="btn" onClick={() => history.push('/manage/'+type)}>clear filters</button>
        </div>);
};