import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateLayout from './PrivateLayout';
import LoginView from './views/authentication/LoginView';
import ForgotView from './views/authentication/ForgotView';
import UserStore from './stores/UserStore';

import NotificationStore from './stores/NotificationStore';
import { Notifier, PrivateRoute } from './utils/bc-components/index';

class Layout extends Flux.View{
    
    constructor(){
        super();
        this.state = {
            loggedIn: UserStore.getAutentication(),
            history: null,
            errors: null,
            redirection: null
        };
        this.bindStore(UserStore, 'session', this.sessionChange.bind(this));
        this.bindStore(NotificationStore, 'notifications', this.notificationsUpdated.bind(this));
    }
    
    componentWillMount(){
        this.sessionChange();
    }
    
    sessionChange(){
        const session = UserStore.getAutentication();
        let needsRedirection = false;
        if(session.history !== null)
        {
            if(typeof session.history.push !== 'undefined' && (session.autenticated && !this.state.loggedIn))
                needsRedirection = true;
        }
        this.setState({ 
            loggedIn: session.autenticated, 
            redirection: needsRedirection,
            history: session.history
        });
    }
    
    redirect(path){
        this.setState({ history: null });
        this.state.history.push(path);
    }
    
    notificationsUpdated(){
        this.setState({
           notifications: NotificationStore.getAllNotifications()
        });
    }
    
    render() {
        if(this.state.redirection && this.state.history) this.redirect('/in/home');

        return (
            <div className="layout">
                <BrowserRouter>
                    <div>
                        <Notifier notifications={this.state.notifications} />
                        <Switch>
                            <Route exact path='/login' component={LoginView} />
                            <Route exact path='/forgot' component={ForgotView} />
                            <PrivateRoute exact path='/' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <PrivateRoute path='/users' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <PrivateRoute path='/home' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <PrivateRoute render={() => (<p className="text-center mt-5">Not found</p>)} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
    
}
export default Layout;
//export default withShortcuts(Layout, keymap)