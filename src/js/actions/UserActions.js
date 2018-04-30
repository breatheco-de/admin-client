import { dispatchEvent } from '@4geeksacademy/react-flux-dash';
import BC from '../utils/api/index';

export const loginUser = (username, password) =>{
    return BC.credentials().autenticate(username, password)
    .then((data) => {
        dispatchEvent("login", data);
    });
};
    
export const logoutUser = (history) => {
    dispatchEvent("logout", null);
};
    
export const remindUser = (email) =>{
        return BC.credentials().remind(email)
        .then((data) => {
            return data;
        });
}