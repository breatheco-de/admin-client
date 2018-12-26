import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel, List } from '../utils/react-components/src/index';
import store from '../store';
import * as AdminActions from '../actions/AdminActions';
import Cards from './ListCards';
import { functions, Filter } from '../utils/filters';
import SortingFunctions from '../utils/sortingFunctions';

export default class ManageView extends Flux.View {
  
    constructor(){
        super();
        this.state ={
            entities: [],
            catalogs: [],
            entitySlug: null,
            searchToken: null,
            urlChange: false
        };
        
    }
    
    initialize(){
        let slug = this.props.match.params.entity_slug;
        let entities = store.getAll(slug);
        if(!entities) entities = [];
        this.EVENT_NAME = "manage_"+slug;
        this.setState({
            entities,
            entitySlug: slug,
            urlChange: false,
            searchToken: '',
            entityComponent: slug+'Card'
        });
        
        this.entitySubscription = store.subscribe(this.EVENT_NAME, this.updateFromStore.bind(this));
        this.catalogSubscription = store.subscribe('catalog', this.updateUpdateCatalogs.bind(this));
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
        this.catalogSubscription.unsubscribe();
    }
    
    updateFromStore(state){
        this.setState({
            entities: state
        });
    }
    
    updateUpdateCatalogs(state){
        this.setState({
            catalogs: state
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
                case "open_in_new_window":
                    window.open(opt.url, '_blank');
                break;
                case "change_event_status":
                    AdminActions.update(this.state.entitySlug, {
                        id: opt.event_id,
                        status: opt.new_status
                    });
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
        let filterFunction = functions[this.state.entitySlug];
        return (typeof filterFunction === 'function') ? filterFunction(entity, { query: this.state.searchToken }) : true;
    }
    
    sortEntity(a, b){
        let sortFunction = SortingFunctions[this.state.entitySlug];
        return (typeof sortFunction === 'function') ? sortFunction(a, b) : null;
    }
  
  render() {
    
    const entities = this.state.entities
                        .filter(this.filterEntity.bind(this))
                        .sort(this.sortEntity.bind(this))
                        .map((data, i) => Cards[this.state.entitySlug+'Card'](data, i, this.onSelect.bind(this)));
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
                        value={this.state.searchToken}
                        placeholder="click to search..."
                    />
                </h2>
                <Filter catalogs={this.state.catalogs} history={this.props.history} type={this.state.entitySlug} />
                <List>
                    {entities}
                </List>
            </Panel>
        </div>
    );
  }
}