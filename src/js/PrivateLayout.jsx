import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Sidebar } from './utils/bc-components/src/index';
import HomeView from './views/HomeView';

import ManageView from './views/ManageView';
import EditView from './views/EditView';
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
                        <Route exact path='/' component={HomeView} />
                        <Route exact path='/home' component={HomeView} />
                        <Route exact path='/dashboard' component={HomeView} />
                        <Route exact path='/manage/:entity_slug/:entity_id/edit' component={EditView} />
                        <Route exact path='/manage/:entity_slug/add' component={EditView} />
                        <Route exact path='/manage/:entity_slug' component={ManageView} />
                        <Route render={() => (<p className="text-center mt-5">Not found</p>)} />
                    </Switch>
                </div>
            </div>
        );
    }
    
}
export default Layout;
//export default withShortcuts(Layout, keymap)