import React from 'react';
import BC from '../utils/api.js';
import Flux from '@4geeksacademy/react-flux-dash';
import store from '../store';
import {Notify} from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import { cohortActions, studentActions, eventActions } from '../actions/CustomActions';
import {logout} from '../utils/react-components/src/index';
import { ZapManager, ModalZapPicker } from '../utils/zaps';

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

export const hook = (slug, args={}) => {
    BC.hook(slug).post(args)
        .then((log) => {
            console.log("Succress", log);
            Notify.add('info', () => <ul>{['Response log from server: '].concat(log).map((m,i) => <li key={i}>{m}</li>)}</ul>, 3000);
        })
        .catch(err => {
            console.log("Error",err);
            Notify.error(err.msg || err.message);
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

        const additionalActions = ZapManager.getZapActions(`add_${type}`);
        Notify.info(({ onConfirm }) => <ModalZapPicker actions={additionalActions} onConfirm={(e) => onConfirm(e)} />, (conf) => conf === null ? Notify.clean() :
            Notify.add("Are you sure? The new stage is: "+conf.stage, (answer) => {
                Notify.clean();
                if(answer){
                    BC[type]().add(data)
                        .then((result) => {
                            Notify.success(`The ${type} was successfully added`);

                            const data = (typeof result.data !== 'undefined') ? result.data : result;
                            Flux.dispatchEvent(`manage_${type}`, store.add(type, data));
                            resolve();

                            conf.actions.forEach(a => ZapManager.execute(a, data));
                        })
                        .catch((error) => {
                            Notify.error(`${error.msg || error}`);
                            reject();
                        });

                    return true;
                }
                return false;
            })
        ,99999999);
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

                const data = (typeof result.data !== 'undefined') ? result.data : result;
                Flux.dispatchEvent(`manage_${type}`, store.replace(type, data));
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