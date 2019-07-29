import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateLayout from './PrivateLayout.js';
import * as AdminActions from './actions/AdminActions';
import { PrivateRoute } from 'bc-react-session';
import { Notifier } from 'bc-react-notifier';
import { Forgot, Login } from './utils/react-components/src/index';

class Layout extends Flux.View{

    constructor(){
        super();
    }

    render() {
        return (
            <div className="layout">
                <BrowserRouter>
                    <div>
                        <Notifier />
                        <Switch>
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/forgot' component={Forgot} />
                            <PrivateRoute exact path='/' component={PrivateLayout} />
                            <PrivateRoute path='/student/:student_id' component={PrivateLayout} />
                            <PrivateRoute path='/manage' component={PrivateLayout} />
                            <PrivateRoute path='/assignment' component={PrivateLayout} />
                            <PrivateRoute path='/dashboard' component={PrivateLayout} />
                            <PrivateRoute path='/:entity_slug/i/:view_slug' component={PrivateLayout} />
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