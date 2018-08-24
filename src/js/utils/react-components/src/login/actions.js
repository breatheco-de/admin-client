import Flux from '@4geeksacademy/react-flux-dash';
import {Session} from 'bc-react-session';
import BC from '../api.js';

BC.setOptions({
    getToken: (type='api')=> {
        const session = Session.store.getSession();
        console.log(session.access_token);
        return 'Bearer '+session.access_token;
    },
    onLogout: () => logoutUser()
});

export const loginUser = (username, password, history) =>{
    return BC.credentials().autenticate(username, password)
    .then((data) => {
        
        const access_token = data.access_token;
        const user = {
            bc_id: data.id,
            wp_id: data.wp_id,
            bio: data.bio,
            cohorts: data.cohorts,
            currently_active: data.currently_active,
            total_points: data.total_points,
            financial_status: data.financial_status,
            avatar: data.avatar_url,
            phone: data.phone,
            github: data.github,
            email: data.email || data.username,
            created_at: data.created_at,
            full_name: data.full_name,
            type: data.type || 'student',
            currentCohort: (data.cohorts) ? (data.cohorts.length === 1) ? data.cohorts[0] : data.cohorts : null
        };
        console.log("Token: ",access_token);
        Session.actions.login({ user , access_token });
        history.push('/');
    });
};
    
export const logoutUser = (history) => {
    Session.actions.logout();
    window.location.href = '/login';
};
    
export const remindUser = (email) =>{
    return BC.credentials().remind(email)
    .then((data) => {
        return data;
    });
}