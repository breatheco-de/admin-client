import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateLayout from './PrivateLayout';
import LoginView from './views/authentication/LoginView';
import ForgotView from './views/authentication/ForgotView';
import UserStore from './stores/UserStore';
import * as AdminActions from './actions/AdminActions';

import NotificationStore from './stores/NotificationStore';
import { Notifier, PrivateRoute } from './utils/bc-components/index';

class Layout extends Flux.View{
    
    constructor(){
        super();
        const session = UserStore.getSession();
        
        this.state = {
            loggedIn: (session && session.autenticated),
            notifications: [],
            errors: null
        };
        AdminActions.get("cohort");
    }
    
    componentDidMount(){
        this.notiSubs = NotificationStore.subscribe("notifications", 
            (notifications) => this.setState({ notifications })
        );
        const session = UserStore.getSession();
        this.setState({
            loggedIn: (session && session.autenticated)
        });
        this.sessionSubscription = UserStore.subscribe("session", this.sessionChange.bind(this));
    }
    
    sessionChange(session){
        this.setState({ 
            loggedIn: session.autenticated, 
        });
    }
    
    redirect(path){
        this.setState({ history: null });
        this.state.history.push(path);
    }
    
    render() {
        return (
            <div className="layout">
                <BrowserRouter>
                    <div>
                        <Notifier notifications={this.state.notifications} />
                        <Switch>
                            <Route exact path='/login' component={LoginView} />
                            <Route exact path='/forgot' component={ForgotView} />
                            <PrivateRoute exact path='/' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <PrivateRoute path='/student/:student_id' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <PrivateRoute path='/manage' loggedIn={this.state.loggedIn} component={PrivateLayout} />
                            <PrivateRoute path='/dashboard' loggedIn={this.state.loggedIn} component={PrivateLayout} />
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