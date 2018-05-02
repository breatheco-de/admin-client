import Flux from '@4geeksacademy/react-flux-dash';

class NotificationStore extends Flux.DashStore{
    constructor(){
        super();
        this.state = {
            notifications: []
        };
        this.addEvent("notifications", this._notificationsTransformer.bind(this));
    }
    
    _notificationsTransformer(notifications){
        return notifications;
    }
    
    getAllNotifications(){
        return this.state.notifications;
    }
}

export default new NotificationStore();