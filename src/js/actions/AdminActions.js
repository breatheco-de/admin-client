import BC from '../utils/api/index';
import Flux from '@4geeksacademy/react-flux-dash';
import AdminStore from '../stores/AdminStore';
import * as Notify from '../actions/NotifyActions';

export const get = (type) => {
    if(typeof BC[type] === 'function') {
        BC[type]().all()
            .then((result) => {
                Flux.dispatchEvent(`manage_${type}`, result.data || result);
            });
    }
    else throw new Error('Invalid fetch type: '+type);
};
    
export const add = (type, data) => {
    if(typeof BC[type] === 'function') {
        BC[type]().add(data)
            .then((result) => {
                Notify.success(`The ${type} was successfully added`);
                
                let state = AdminStore.getState();
                let entities = state[`manage_${type}`].concat([data]);
                Flux.dispatchEvent(`manage_${type}`, entities);
            })
            .catch((error) => {
                Notify.error(`Error: ${error.msg || error}`);
            });
    }
    else throw new Error('Invalid fetch type: '+type);
};
    
export const update = (type, data) => {
    if(typeof BC[type] === 'function') {
        BC[type]().update(data.id)
            .then((result) => {
                Notify.success(`The ${type} was successfully updated`);
                
                let state = AdminStore.getState();
                let entities = state[`manage_${type}`].map(ent => {
                    if(ent.id !== data.id) return ent;
                    else return data;
                });
                
                Flux.dispatchEvent(`manage_${type}`, entities);
            });
    }
    else Flux.dispatchEvent("notifications", [{
                msg: `There was a problem updating the ${type}`, type: 'info'
            }]);
};
    
export const remove = (type, data) => {
    
    Flux.dispatchEvent("notifications", [{
        msg: "Are you sure?",
        type: 'info',
        onConfirm: (answer) => {
            if(answer){
                if(typeof BC[type] === 'function') {
                    BC[type]().delete(data.id)
                        .then((result) => {
                            Notify.success(`The ${type} was successfully deleted`);
                            
                            let state = AdminStore.getState();
                            let entities = state[`manage_${type}`].filter(ent => ent.id !== data.id);
                            
                            Flux.dispatchEvent(`manage_${type}`, entities);
                        });
                }
                else throw new Error('Invalid fetch type: '+type);
            }
            
            Flux.dispatchEvent("notifications", []);
        }
    }]);
    
};

export const firstUpperCase = (input) => { return input[0].toUpperCase()+input.substr(1); };