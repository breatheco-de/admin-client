import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateLayout from './PrivateLayout';
import * as AdminActions from './actions/AdminActions';

import { Notifier, PrivateRoute, Session, ForgotView, LoginView } from './utils/bc-components/src/index';

class Layout extends Flux.View{
    
    constructor(){
        super();
        const session = Session.getSession();
        
        this.state = {
            loggedIn: (session && session.autenticated),
            notifications: [],
            errors: null
        };
        AdminActions.get(["cohort","location",'profile']);
    }
    
    componentDidMount(){
        const session = Session.getSession();
        this.setState({
            loggedIn: (session && session.autenticated)
        });
        this.sessionSubscription = Session.subscribe("session", this.sessionChange.bind(this));
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
                        <Notifier />
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