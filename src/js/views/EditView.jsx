import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel, List, DropLink } from '../utils/bc-components/index';

import AdminStore from '../stores/AdminStore';
import * as AdminActions from '../actions/AdminActions';

export default class ManageView extends Flux.View {
  
    constructor(){
        super();
        this.state ={
            entity: null,
            entitySlug: null,
            mode: null
        };
        
    }
    
    componentDidMount(){
        let slug = this.props.match.params.entity_slug;
        const ComponentName = slug.charAt(0).toUpperCase() + slug.substr(1)+'Form';
        if(this.props.match.params.entity_id){
            this.setState({
                mode: 'edit',
                entity: AdminStore.getSingle(slug, this.props.match.params.entity_id),
                entitySlug: slug,
                entityComponent: require('./forms/'+ComponentName).default
            });
        }
        else{
            this.setState({
                mode: 'add',
                entitySlug: slug,
                entityComponent: require('./forms/'+ComponentName).default
            });
        }
    }
    
    onSave(data){
        if(this.state.mode==='add') AdminActions.add(this.state.entitySlug, data);
        else if(this.state.mode==='edit') AdminActions.update(this.state.entitySlug, data);
        else console.error('Uknown method '+this.state.mode);
        
        this.props.history.push(`/manage/${this.state.entitySlug}/`);
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
                        data={this.state.entity} onSave={this.onSave.bind(this)} 
                        mode={this.state.mode}
                    />
                </div>
            </Panel>
        </div>
    );
  }
}