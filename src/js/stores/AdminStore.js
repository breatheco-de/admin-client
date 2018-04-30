/* global localStorage */
import Flux from '@4geeksacademy/react-flux-dash';

class AdminStore extends Flux.DashStore{
    constructor(){
        super();
        
        this.state = {
            entities: null
        };
        
        // Or Declare an event with some transformation logic
        this.addEvent("fetch_entity", this._fetchEntity.bind(this));
    }
    
    _fetchEntity(results){ 
        return Object.assign(this.state, {
            entities: results
        }); 
    }
    getSingle(type, id){ 
        if(!this.state.entities || typeof this.state.entities[type] === 'undefined') return null;
        
        let results = this.state.entities[type].filter((ent) => ent.id == id); 
        if(results.length === 1) return results[0];
        else if(results.length === 0) return null;
        else if(results.length >1) throw new Error('There seems to be more than one entity with the id '+id);
    }
    
}
export default new AdminStore();