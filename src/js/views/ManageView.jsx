import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel, List, DropLink } from '../utils/bc-components/index';

import AdminStore from '../stores/AdminStore';
import AdminActions from '../actions/AdminActions';
import Cards from './ListCards';

export default class ManageView extends Flux.View {
  
    constructor(){
        super();
        this.state ={
            entities: [],
            entitySlug: null
        }
        
    }
    
    componentDidMount(){
        
        this.entitySubscription = AdminStore.subscribe("fetch_entity", this.updateFromStore.bind(this));
        
        let eventStates = AdminStore.getState();
        if(typeof eventStates["fetch_entity"] === 'undefined') return null;
        this.updateFromStore(eventStates["fetch_entity"]);
    }
    
    updateFromStore(state){
        this.setState({
            entities: (state.entities) ? state.entities[this.props.match.params.entity_slug] : [],
            entitySlug: this.props.match.params.entity_slug,
            entityComponent: this.props.match.params.entity_slug+'Card'
        });
    }
    
    onUserSelect(opt, user){
        switch(opt.slug){
            case "edit":
                this.props.history.push('/manage/user/'+user.id+'/edit');
            break;
        }
    }
  
  render() {
    
    const entities = this.state.entities.map((data, i) => Cards[this.state.entitySlug+'Card'](data, i, this.onUserSelect.bind(this)));
    return (
        <div className="with-padding">
            <Panel style={{padding: "10px"}} zDepth={1}>
                <ul className="nav float-right">
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => this.props.history.push('/manage/user/add')}>add {this.state.entitySlug}</a>
                    </li>
                </ul>
                <h2>{this.state.entitySlug}</h2>
                <List>
                    {entities}
                </List>
            </Panel>
        </div>
    );
  }
}