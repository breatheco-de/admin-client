/* global localStorage */
import Flux from '@4geeksacademy/react-flux-dash';
import moment from 'moment';
class AdminStore extends Flux.DashStore{
    constructor(){
        super();
        
        this.state = {
            user: []
        };
        
        // Or Declare an event with some transformation logic
        this.addEvent("manage_user", this._transformUsers.bind(this));
        this.addEvent("manage_student", this._transformStudents.bind(this));
        this.addEvent("manage_cohort", this._transformCohorts.bind(this));
        this.addEvent("manage_location", this._transformLocation.bind(this));
        this.addEvent("manage_profile", this._transformProfile.bind(this));
        this.addEvent("manage_event", this._transformEvent.bind(this));
    }
    
    _transformUsers(users){ 
        if(!Array.isArray(users)) return users;
        return users.filter(user => user.type !== 'student'); 
    }
    _transformStudents(results){ return Array.isArray(results) ? results : []; }
    _transformLocation(results){ return Array.isArray(results) ? results : []; }
    _transformCohorts(results){ return Array.isArray(results) ? results : []; }
    _transformProfile(results){ return Array.isArray(results) ? results : []; }
    _transformEvent(results){ 
        if(!Array.isArray(results)) return results;
        results = results.map((ev) => {
            const startTime = moment(ev.event_date);
            if(startTime.isBefore(moment())) ev.hasPassed = true;
            else ev.hasPassed = false;
            
            if(ev.recurrent_type && ev.recurrent_type != 'one_time'){ //if is recurrent i look for the next upcoming event of that type
                const childs = results.filter(child => child.parent_event == ev.id);
                ev.event_date = childs.length > 0 ? childs[0].event_date : null;
            } 
            return ev;
        });
        
        results = results.filter((ev) => (ev.parent_event == null));
        
        return results; 
    }
    
    getSingle(type, id){ 
        let entities = this.getAll(type);
        let results = entities.filter((ent) => ent.id == id); 
        if(results.length === 1) return results[0];
        else if(results.length === 0) return null;
        else if(results.length >1) throw new Error(`There seems to be more than one ${type} with the id: ${id}`);
    }
    getSingleBy(type, key, value){ 
        let entities = this.getAll(type);
        let results = entities.filter((ent) => ent[key] == value); 
        if(results.length === 1) return results[0];
        else if(results.length === 0) return null;
        else if(results.length >1) throw new Error(`There seems to be more than one ${type} with the ${key}: ${value}`);
    }
    getAll(type){ 
        let result = this.getState();
        if(typeof result[`manage_${type}`] === 'undefined' || !result[`manage_${type}`]) return [];
        else return result[`manage_${type}`];
    }
    replace(type, newEntity){
        if(!newEntity || typeof newEntity.id == 'undefined') throw new Error(`Invalid ${type} to replate`);
        let entities = this.getAll(type);
        return entities.map((ent) => (ent.id !== newEntity.id) ? ent : newEntity); 
    }
    add(type, newEntity){
        if(!newEntity || typeof newEntity.id == 'undefined') throw new Error(`Invalid ${type} to replate`);
        let entities = this.getAll(type);
        return entities.concat([newEntity]); 
    }
    
}
export default new AdminStore();