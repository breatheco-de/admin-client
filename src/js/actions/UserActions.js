import Flux from '@4geeksacademy/react-flux-dash';
import BC from '../utils/api/index';

export const loginUser = (username, password) =>{
    return BC.credentials().autenticate(username, password)
    .then((data) => {
        Flux.dispatchEvent("session", {
            githubToken: null,
            autenticated: true,
            breathecodeToken: data.access_token,
            user: {
                email: data.username,
                full_name: data.full_name,
                type: data.type || 'student'
            }
        });
        
        window.location.href="/dashboard";
    });
};
    
export const logoutUser = (history) => {
    Flux.dispatchEvent("session", { 
        autenticated: false,
        breathecodeToken: null,
        user: null
    });
    window.location.href="/login";
};
    
export const remindUser = (email) =>{
        return BC.credentials().remind(email)
        .then((data) => {
            return data;
        });
}