import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Sidebar } from './utils/bc-components/index';
import HomeView from './views/HomeView';
import UsersView from './views/UsersView';

import MainMenu from './components/menus/MainMenu';

class Layout extends Flux.View{
    
    constructor(){
        super();
        this.state = {
            menuItems: [
                { slug: 'dashboard', label: 'Dashboard', component: MainMenu },
            ]
        };
    }
    
    menuClicked(){
        
    }
    
    render() {

        return (
            <div className="row">
                <div className="col-4 col-sm-3 col-lg-2">
                    <Sidebar onSelect={() => this.menuClicked()}
                        menuItems={this.state.menuItems}
                    />
                </div>
                <div className="col-8 col-sm-9 col-lg-10">
                    <Switch>
                        <Route exact path='/home' component={HomeView} />
                        <Route exact path='/dashboard' component={UsersView} />
                        <Route exact path='/users' component={UsersView} />
                        <Route render={() => (<p className="text-center mt-5">Not found</p>)} />
                    </Switch>
                </div>
            </div>
        );
    }
    
}
export default Layout;
//export default withShortcuts(Layout, keymap)