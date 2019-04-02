import React from 'react';
import Flux from '@4geeksacademy/react-flux-dash';
import { Route, Switch } from 'react-router-dom';

import { Sidebar } from './utils/react-components/src/index';
import HomeView from './views/HomeView';

import ManageView from './views/ManageView';
import IFrameView from './views/IFrameView';
import IFrameManageView from './views/IFrameManageView';
import EditView from './views/EditView';
import {menuModes}  from './utils/menu';
import { ZapActionRenderer, fetchZaps } from './utils/zaps';
import * as AdminActions from './actions/AdminActions';

class Layout extends Flux.View{
    
    constructor(){
        super();
        this.state = {
            menuItems: menuModes.home,
            currentMenuOption: menuModes.home[0],
        };
        AdminActions.get(["cohort","location",'profile']);
        AdminActions.fetchCatalogs();
    }
    
    componentDidMount(){
        fetchZaps();
    }
    
    render() {

        return (
            <div className="row">
                <div className="left-side">
                    <Sidebar 
                        onSelect={() => this.menuClicked()}
                        breadcrumb={[{ label: "BreatheCode", path: '/home' }]}
                        menuItems={this.state.menuItems}
                        selectedOption={this.state.currentMenuOption}
                    />
                </div>
                <div className="right-side">
                    <Switch>
                        <Route exact path='/' component={HomeView} />
                        <Route exact path='/home' component={HomeView} />
                        <Route exact path='/dashboard' component={HomeView} />
                        <Route exact path='/manage/i/:entity_slug' component={IFrameManageView} />
                        <Route exact path='/manage/:entity_slug/:entity_id/edit' component={EditView} />
                        <Route exact path='/manage/:entity_slug/add' component={EditView} />
                        <Route exact path='/manage/:entity_slug' component={ManageView} />
                        <Route exact path='/:entity_slug/i/:view_slug' component={IFrameView} />
                        <Route render={() => (<p className="text-center mt-5">Not found</p>)} />
                    </Switch>
                </div>
                <ZapActionRenderer />
            </div>
        );
    }
    
}
export default Layout;
//export default withShortcuts(Layout, keymap)