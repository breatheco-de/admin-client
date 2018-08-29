import queryString from 'query-string';

export default {
    student: (entity, extraSearch) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='cohort') valid = (entity.cohorts.indexOf(token) !== -1 );
            else if(key=='name') valid = (entity.full_name.toLowerCase().search(token) !== -1 );
            else if(key=='email') valid = (entity.email.toLowerCase().search(token) !== -1 );
        }
        if(valid && extraSearch){
            let nameMatches = (entity.full_name.toLowerCase().search(extraSearch) !== -1 );
            let emailMatches = (entity.email.toLowerCase().search(extraSearch) !== -1 );
            if(nameMatches || emailMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    },
    user: (entity, extraSearch) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='name') valid = (entity.full_name.toLowerCase().search(token) !== -1 );
            else if(key=='email') valid = (entity.username.toLowerCase().search(token) !== -1 );
        }
        if(valid && extraSearch){
            let nameMatches = (entity.full_name.toLowerCase().search(extraSearch) !== -1 );
            let emailMatches = (entity.username.toLowerCase().search(extraSearch) !== -1 );
            if(nameMatches || emailMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    },
    cohort: (entity, extraSearch) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='name') valid = (entity.name.toLowerCase().search(token) !== -1 );
            else if(key=='profile') valid = (entity.profile_slug.toLowerCase().search(token) !== -1 );
        }
        if(valid && extraSearch){
            let nameMatches = (entity.name.toLowerCase().search(extraSearch) !== -1 );
            if(nameMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    },
    event: (entity, extraSearch) => {
        const searchParams = queryString.parse(window.location.search);
        let valid = true;
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='name') valid = (entity.title.toLowerCase().search(token) !== -1 );
        }
        if(valid && extraSearch){
            let nameMatches = (entity.title.toLowerCase().search(extraSearch) !== -1 );
            if(nameMatches) valid = true;
            else valid = false;
        }
        
        return valid;
    }
};