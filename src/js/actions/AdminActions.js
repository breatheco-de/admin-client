import BC from '../utils/api.js';
import Flux from '@4geeksacademy/react-flux-dash';
import AdminStore from '../stores/AdminStore';
import {Notify} from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import { cohortActions, studentActions, eventActions } from '../actions/CustomActions';
import {logout} from '../utils/react-components/src/index';

BC.setOptions({
    getToken: (type='api')=> {
        const session = Session.store.getSession();
        if(type=='assets') 
            return (session.user) ? 'JWT '+session.user.assets_token:'';
        else return 'Bearer '+session.access_token;
    },
    onLogout: () => logout()
});

export const get = (types) => {
    if(!Array.isArray(types)) types = [].concat([types]);
    types.forEach(function(type){
        switch(type){
            case "event":
                BC[type]().all().then((result) => {
                    Flux.dispatchEvent(`manage_${type}`, result.data || result);
                });
            break;
            default:
                if(typeof BC[type] === 'function') BC[type]().all().then((result) => {
                    Flux.dispatchEvent(`manage_${type}`, result.data || result);
                });
                else throw new Error('Invalid fetch type: '+type);
            break;
        }
    });
};
    
export const add = (type, data) => new Promise((resolve, reject) => {
    if(typeof BC[type] === 'function') {
        BC[type]().add(data)
            .then((result) => {
                Notify.success(`The ${type} was successfully added`);
                
                let state = AdminStore.getState();
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
                
                let state = AdminStore.getState();
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
                        
                        let state = AdminStore.getState();
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