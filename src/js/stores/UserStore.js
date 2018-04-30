/* global localStorage */
import Flux from '@4geeksacademy/react-flux-dash';

class UserStore extends Flux.DashStore{
    constructor(){
        super();
        
        this.state = this.getPersistedState();
        if (!this.state)
        {
            this.state = {
                breathecodeToken: null,
                githubToken: null,
                history: null,
                user: null,
                autenticated: false
            };
        }
        this.state.todos = null;
        
        // Or Declare an event with some transformation logic
        this.addEvent("login", this._login.bind(this));
        this.addEvent("logout", this._logout.bind(this));
    }
    
    setPersistedState(data){
        const newState = Object.assign(this.state, data);
        localStorage.setItem('user_store', JSON.stringify(newState));
        return newState;
    }
    getPersistedState(data){
        let persistedState = JSON.parse(localStorage.getItem('user_store'));
        return persistedState;
    }
    
    _login(data){
        return this.setPersistedState({
            githubToken: null,
            autenticated: true,
            history: data.history,
            todos: [],
            breathecodeToken: data.access_token,
            user: {
                bc_id: data.id,
                cohorts: data.cohorts,
                financial_status: data.financial_status,
                bio: data.bio,
                github: data.github,
                phone: data.phone,
                currently_active: data.currently_active,
                total_points: data.total_points,
                wp_id: data.wp_id,
                created_at: data.created_at,
                email: data.username,
                avatar: data.avatar_url,
                full_name: data.full_name,
                type: data.type || 'student'
            }
        });
    }
    _logout(data){
        return this.setPersistedState({ 
            autenticated: false,
            breathecodeToken: null,
            user: null
        });
    }
    
    getAutentication(){
        return {
            autenticated: this.state.autenticated,
            history: this.state.history
        };
    }
    
    getUser(){
        return this.state.user;
    }
    
}

var userStore = new UserStore();
export default userStore;