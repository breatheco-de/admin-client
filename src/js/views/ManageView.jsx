import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel, List } from '../utils/bc-components/index';

import AdminStore from '../stores/AdminStore';
import * as AdminActions from '../actions/AdminActions';
import Cards from './ListCards';
import SearchFunctions from './SearchFunctions';

export default class ManageView extends Flux.View {
  
    constructor(){
        super();
        this.state ={
            entities: [],
            entitySlug: null,
            searchToken: null,
            urlChange: false
        };
        
    }
    
    initialize(){
        let slug = this.props.match.params.entity_slug;
        let entities = AdminStore.getAll(slug);
        this.EVENT_NAME = "manage_"+slug;
        this.setState({
            entities,
            entitySlug: slug,
            urlChange: false,
            entityComponent: slug+'Card'
        });
        this.entitySubscription = AdminStore.subscribe(this.EVENT_NAME, this.updateFromStore.bind(this));
        AdminActions.get(slug);
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        if(typeof nextProps.match !== 'undefined')
            if(nextProps.match.params.entity_slug != prevState.entitySlug)
                return {
                    urlChange: true
                };
        return null;
    }
    
    
    componentDidMount(){
        this.initialize();
    }
    
    componentDidUpdate(){
        if(this.state.urlChange){
            if(this.entitySubscription) this.entitySubscription.unsubscribe();
            this.initialize();
        }
    }
    
    componentWillUnmount(){
        this.entitySubscription.unsubscribe();
    }
    
    updateFromStore(state){
        this.setState({
            entities: state
        });
    }
    
    onSelect(opt, ent){
        
        if(typeof opt.to === 'string') this.props.history.push(opt.to);
        else{
            switch(opt.slug){
                case "edit":
                    this.props.history.push(`/manage/${this.state.entitySlug}/${ent.id}/edit`);
                break;
                case "delete":
                    AdminActions.remove(this.state.entitySlug, ent);
                break;
                default:
                    if(typeof AdminActions.custom[this.state.entitySlug][opt.slug] === 'undefined')
                        throw new Error(`Undefined custom action ${this.state.entitySlug}.${opt.slug}()`);
                    else AdminActions.custom[this.state.entitySlug][opt.slug](opt.data);
                break;
            }
        }
    }
    
    filterEntity(entity){
        let seatchFunction = SearchFunctions[this.state.entitySlug];
        return (typeof seatchFunction === 'function') ? seatchFunction(entity, this.state.searchToken) : true;
    }
  
  render() {
    
    const entities = this.state.entities.filter(this.filterEntity.bind(this)).map((data, i) => Cards[this.state.entitySlug+'Card'](data, i, this.onSelect.bind(this)));
    return (
        <div className="with-padding">
            <Panel style={{padding: "10px"}} zDepth={1}>
                <ul className="nav float-right">
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => this.props.history.push(`/manage/${this.state.entitySlug}/add`)}>add {this.state.entitySlug}</a>
                    </li>
                </ul>
                <h2>
                    {this.state.entitySlug}
                    <input className="ml-3 search-entity" type="text" 
                        onChange={(e) => this.setState({ searchToken: e.target.value })} 
                        placeholder="click to search..."
                    />
                </h2>
                <List>
                    {entities}
                </List>
            </Panel>
        </div>
    );
  }
}