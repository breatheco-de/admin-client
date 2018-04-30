import BC from '../utils/api/index';
import Flux from '@4geeksacademy/react-flux-dash';

export const get = (type) => {
    if(typeof BC[type] === 'function') {
        BC[type]().all()
            .then((result) => {
                type = firstUpperCase(type);
                Flux.dispatchEvent("fetch_entity", {
                    user: result.data || result
                });
            });
    }
    else throw new Error('Invalid fetch type: '+type);
};
    
export const add = (type, data) => {
    if(typeof BC[type] === 'function') {
        BC[type]().add(data)
            .then((result) => {
                type = this.firstUpperCase(type);
                Flux.dispatchEvent("add_entity", result.data || result);
            });
    }
    else throw new Error('Invalid fetch type: '+type);
};

export const firstUpperCase = (input) => { return input[0].toUpperCase()+input.substr(1); };