import Flux from '@4geeksacademy/react-flux-dash';
import BC from '../utils/api/index';
import NotifyStore from '../stores/NotificationStore';

export const remove = (id) =>{
    let state = NotifyStore.getState();
    let notifications = state['notifications'].filter(noti => noti.id != id);
    Flux.dispatchEvent("notifications", notifications);
};

export const add = (type, message, confirm=null) =>{
    
    let state = NotifyStore.getState();
    let notyId = Math.floor(Math.random() * 100000000000);
    if(typeof state['notifications'] === 'undefined') state['notifications'] = [];
    let notifications = state['notifications'].concat([{
        id: notyId,
        msg: message,
        type: type,
        onConfirm: confirm
    }]);
    
    Flux.dispatchEvent("notifications", notifications);
    
    setTimeout(() => {
        remove(notyId);
    },6000);
};

export const success = (msg, conf) => add('success', msg, conf);
export const error = (msg, conf) => add('error', msg, conf);
export const info = (msg, conf) => add('info', msg, conf);