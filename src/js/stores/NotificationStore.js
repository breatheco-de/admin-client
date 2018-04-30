import Flux from '@4geeksacademy/react-flux-dash';

class NotificationStore extends Flux.DashStore{
    constructor(){
        super();
        this.state = {
            notifications: [],
            templates: {
                update_todos_error: { msg: "There has been an error adding your new todos", type: "error" }
            }
        };
        this.addEvent("notifications", this._notify.bind(this));
    }
    
    getNotification(slug){
        if(typeof this.state.templates[slug] === 'undefined') throw new Error(`Invalid error template slug: ${slug}`);
        
        return { slug: slug, msg: this.state.templates[slug].msg, type: this.state.templates[slug].type };
    }
    
    _notify(notification){
        return this.state.notifications;
        
        // setTimeout(() => {
        //     this.setStoreState({ 
        //         notifications: this.state.notifications.filter((noti) => noti.slug !== slug)
        //     }).emit('notifications');
        // },4000);
    }
    
    getAllNotifications(){
        return this.state.notifications;
    }
}

export default new NotificationStore();