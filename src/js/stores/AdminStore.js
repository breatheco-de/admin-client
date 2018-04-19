/* global localStorage */
import Flux from '@4geeksacademy/react-flux-dash';

class AdminStore extends Flux.Store{
    constructor(){
        super();
        
        this.state = {
            users: null
        };
    }
    
    _setUsers(users){ this.setStoreState({ users }).emit('users'); }
    getUsers(){ return this.state.users; }
    
}
export default new AdminStore();