import BC from '../utils/api.js';
import Flux from '@4geeksacademy/react-flux-dash';
import store from '../store';
import {Notify} from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import { cohortActions, studentActions, eventActions } from '../actions/CustomActions';
import {logout} from '../utils/react-components/src/index';

BC.setOptions({
    getToken: (type='api')=> {
        const payload = Session.getPayload();
        if(type=='assets') 
            return (payload) ? 'JWT '+payload.assets_token:'';
        else return 'Bearer '+payload.access_token;
    },
    onLogout: () => logout()
});

export const get = (types, args={}) => {
    if(!Array.isArray(types)) types = [].concat([types]);
    types.forEach(function(type){
        switch(type){
            case "event":
                BC[type]().all({ unlisted: true }).then((result) => {
                    Flux.dispatchEvent(`manage_${type}`, result.data || result);
                });
            break;
            default:
                const { parent_location_id } = Session.getPayload();
                let _args = {};
                if(typeof parent_location_id !== 'undefined' && parent_location_id) _args.location_id = parent_location_id;
                if(typeof BC[type] === 'function') BC[type]().all(Object.assign(_args,args)).then((result) => {
                    Flux.dispatchEvent(`manage_${type}`, result.data || result);
                });
                else throw new Error('Invalid fetch type: '+type);
            break;
        }
    });
};

export const getSingle = (type, id) => {
    if(typeof BC[type] === 'function') BC[type]().get(id).then((result) => {
        Flux.dispatchEvent(`manage_${type}`, store.add(`manage_${type}`, result.data || result));
    });
    else throw new Error('Invalid fetch type: '+type);
};

export const fetchCatalogs = (types=null) => {
    if(!types){
        BC.catalog().all().then((result) => Flux.dispatchEvent(`catalog`, result.data || result));
        return;
    } 
    if(!Array.isArray(types)) types = [].concat([types]);
    types.forEach(function(slug){
            BC.catalog().get(slug).then((result) => {
                let catalog = {};
                catalog[slug] = result.data || result;
                Flux.dispatchEvent(`catalog`, Object.assign(store.getState('catalog') || {}, catalog));
            });
    });
};

export const add = (type, data) => new Promise((resolve, reject) => {
    if(typeof BC[type] === 'function') {
        BC[type]().add(data)
            .then((result) => {
                Notify.success(`The ${type} was successfully added`);
                
                let state = store.getState();
                const data = (typeof result.data !== 'undefined') ? result.data : result;
                let entities = state[`manage_${type}`].concat([data]);
                Flux.dispatchEvent(`manage_${type}`, entities);
                resolve();
            })
            .catch((error) => {
                Notify.error(`${error.msg || error}`);
                reject();
            });
    }
    else{
        reject();
        throw new Error('Invalid fetch type: '+type);
    } 
});
    
export const update = (type, data) => new Promise((resolve, reject) => {
    if(typeof BC[type] === 'function') {
        delete data.email;
        BC[type]().update(data.id, data)
            .then((result) => {
                Notify.success(`The ${type} was successfully updated`);
                
                let state = store.getState();
                const data = (typeof result.data !== 'undefined') ? result.data : result;
                let entities = state[`manage_${type}`].map(ent => {
                    if(ent.id !== data.id) return ent;
                    else return data;
                });
                
                Flux.dispatchEvent(`manage_${type}`, entities);
                resolve();
            })
            .catch((error) => {
                reject();
                Notify.error(`${error.msg || error}`);
            });
    }
    else{
        reject();
        throw Error(`There is no type ${type} on the BC api wrapper`);
    } 
});
    
export const remove = (type, data) => new Promise((resolve, reject) => {
    
    Notify.info("Are you sure?", (answer) => {
        if(answer){
            if(typeof BC[type] === 'function') {
                BC[type]().delete(data.id)
                    .then((result) => {
                        Notify.success(`The ${type} was successfully deleted`);
                        
                        let state = store.getState();
                        let entities = state[`manage_${type}`].filter(ent => ent.id !== data.id);
                        
                        Flux.dispatchEvent(`manage_${type}`, entities);
                        resolve();
                    })
                    .catch((error) => {
                        reject();
                        Notify.error(`${error.msg || error}`);
                    });
            }
            else{
                reject();
                throw new Error('Invalid fetch type: '+type);
            } 
        }
    });
    
});

export const firstUpperCase = (input) => { return input[0].toUpperCase()+input.substr(1); };

export const custom = {
    cohort: cohortActions,
    student: studentActions,
    event: eventActions
};