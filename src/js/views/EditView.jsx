import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel } from '../utils/react-components/src/index';
import { Notify } from 'bc-react-notifier';

import store from '../store';
import * as AdminActions from '../actions/AdminActions';

export default class ManageView extends Flux.View {
  
    constructor(){
        super();
        this.state ={
            entity: null,
            entitySlug: null,
            mode: null
        };
        this.storeUpdatedListener = null;
    }
    
    storeUpdated(){
        let entity = store.getSingle(this.props.match.params.entity_slug, this.props.match.params.entity_id);
        this.setState({
            entity,
            mode: 'edit',
            entitySlug: this.props.match.params.entity_slug,
            entityComponent: require('./forms/'+this.getComponent()).default
        });
    }
    getComponent(){
        return this.props.match.params.entity_slug.charAt(0).toUpperCase() + this.props.match.params.entity_slug.substr(1)+'Form';
    }
    fullEntityLoaded(){
    }
    componentDidMount(){
        if(this.props.match.params.entity_id){
            let entity = store.getSingle(this.props.match.params.entity_slug, this.props.match.params.entity_id);
            if(!entity){
                setTimeout(() => {
                    AdminActions.getSingle(this.props.match.params.entity_slug, this.props.match.params.entity_id);
                }, 500);
            }
            
            this.setState({
                entity,
                mode: 'edit',
                entitySlug: this.props.match.params.entity_slug,
                entityComponent: require('./forms/'+this.getComponent()).default
            });
            this.storeUpdatedListener = store.subscribe(`manage_${this.props.match.params.entity_slug}`, this.storeUpdated.bind(this));
        }
        else{
            this.setState({
                mode: 'add',
                entitySlug: this.props.match.params.entity_slug,
                entityComponent: require('./forms/'+this.getComponent()).default
            });
        }
    }
    
    componentWillUnmount(){
        if(this.storeUpdatedListener) this.storeUpdatedListener.unsubscribe();
    }
    
    onSave(data){
        if(this.state.mode==='add') 
            AdminActions.add(this.state.entitySlug, data)
                .then(resp => this.props.history.push(`/manage/${this.state.entitySlug}/`));
        
        else if(this.state.mode==='edit') 
            AdminActions.update(this.state.entitySlug, data)
                .then(resp => this.props.history.push(`/manage/${this.state.entitySlug}/`));
        
        else console.error('Uknown method '+this.state.mode);
    }
    
    onError(errors){
        Notify.error(errors);
    }
  
  render() {
      
    if(!this.state.entityComponent || (this.state.mode=="edit" && !this.state.entity)) return (<p>Loading...</p>);
    return (
        <div className="with-padding">
            <Panel style={{padding: "10px"}} zDepth={1}>
                { 
                    (this.state.mode == 'edit') ?
                        <h2>Edit {this.state.entitySlug} {this.state.entity.id}</h2>
                        :
                        <h2>Add new {this.state.entitySlug}</h2>
                }
                <div>
                    <this.state.entityComponent 
                        data={this.state.entity}
                        onSave={this.onSave.bind(this)} 
                        onError={this.onError.bind(this)} 
                        mode={this.state.mode}
                    />
                </div>
            </Panel>
        </div>
    );
  }
}