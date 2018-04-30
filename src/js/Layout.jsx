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
            loggedIn: null,
            history: null,
            errors: null,
            redirection: null
        };
        
    }
    
    componentDidMount(){
        this.notiSubs = NotificationStore.subscribe("notifications", 
            (notifications) => this.setState({ notifications })
        );
        this.loginSubscription = UserStore.subscribe("login", this.sessionChange.bind(this));
    }
    
    sessionChange(session){
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
                            <Route exact path='/' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <Route path='/manage' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <Route path='/dashboard' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <Route render={() => (<p className="text-center mt-5">Not found</p>)} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
    
}
export default Layout;
//export default withShortcuts(Layout, keymap)