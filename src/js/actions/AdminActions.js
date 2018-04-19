import Flux from '@4geeksacademy/react-flux-dash';
import BC from '../utils/api/index';

import NotificationStore from '../stores/NotificationStore';

class AdminActions extends Flux.Action{
    
    constructor(){
        super();
    }
    
    fetch(type){
        if(typeof BC[type] === 'function') {
            BC[type]().all()
                .then((result) => {
                    type = this.firstUpperCase(type)
                    this.dispatch('AdminStore.set'+type, result.data || result); 
                });
        }
        else throw new Error('Invalid fetch type: '+type);
    }
    
    add(type){
        if(typeof BC[type] === 'function') {
            BC[type]().add()
                .then((result) => {
                    type = this.firstUpperCase(type)
                    this.dispatch('AdminStore.set'+type, result.data || result); 
                });
        }
        else throw new Error('Invalid fetch type: '+type);
    }
    
    
    
    firstUpperCase(input) { return input[0].toUpperCase()+input.substr(1); }
}
export default new AdminActions();