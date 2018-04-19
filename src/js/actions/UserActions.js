import Flux from '@4geeksacademy/react-flux-dash';
import WP from 'wordpress-rest-api';
import BC from '../utils/api/index';

import UserStore from '../stores/UserStore';
import NotificationStore from '../stores/NotificationStore';

class UserActions extends Flux.Action{
    
    constructor(){
        super();
    }
    
    loginUser(username, password, history){
     
        return BC.credentials().autenticate(username, password)
        .then((data) => {
            data.history = history;
            this.dispatch('UserStore.login', data);
        });
    }
    
    logoutUser(history){
        this.dispatch('UserStore.logout');
    }
    
    remindUser(email){
     
        return BC.credentials().remind(email)
        .then((data) => {
            return data;
        });
    }
    
}
export default new UserActions();