import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel, List, DropLink } from '../utils/bc-components/index';

import AdminStore from '../stores/AdminStore';
import AdminActions from '../actions/AdminActions';

export default class UsersView extends Flux.View {
  
    constructor(){
    super();
        this.state ={
            users: [],
            dropdownOptions: [
                { label: 'edit', slug: 'edit' }
            ]
        }
        this.bindStore(AdminStore, 'users', () => {
            this.setState({
               users: AdminStore.getUsers()
            });
        });
    }
    
    componentDidMount(){
        AdminActions.fetch('users');
    }
  
  render() {
     const users = this.state.users.map((user, i) => (
         <li key={i}>
            <DropLink
            dropdown={this.state.dropdownOptions}>
            {user.full_name}, {user.username} 
            </DropLink>
        </li>
    ));
    return (
        <div className="with-padding">
            <Panel style={{padding: "10px"}} zDepth={1}>
                <ul className="nav float-right">
                    <li className="nav-item">
                        <a className="nav-link" href="#">add user</a>
                    </li>
                </ul>
                <h2>Users</h2>
                <List>
                    {users}
                </List>
            </Panel>
        </div>
    );
  }
}