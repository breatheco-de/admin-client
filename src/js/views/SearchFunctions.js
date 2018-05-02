import queryString from 'query-string';

export default {
    student: (entity) => {
        const searchParams = queryString.parse(window.location.search);
        for(let key in searchParams){
            const token = searchParams[key].toLowerCase();
            if(key=='cohort') return (entity.cohorts.indexOf(token) !== -1 );
            else if(key=='name') return (entity.full_name.toLowerCase().search(token) !== -1 );
            else if(key=='email') return (entity.email.toLowerCase().search(token) !== -1 );
        }
        return true;
    },
    user: () => true
};