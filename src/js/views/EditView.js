import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel } from '../utils/react-components/src/index';
import { Notify } from 'bc-react-notifier';
import { cards, cardActions} from './ListCards';
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
        const formName = this.getFormName();

        this.setState({
            entity,
            mode: 'edit',
            entitySlug: this.props.match.params.entity_slug,
            entityComponent: require('./forms/'+formName).default
        });
    }
    getFormName(){
        return this.props.match.params.entity_slug.charAt(0).toUpperCase() + this.props.match.params.entity_slug.substr(1)+'Form.js';
    }
    fullEntityLoaded(){
    }
    componentDidMount(){
        if(this.props.match.params.entity_id){
            let entity = store.getSingle(this.props.match.params.entity_slug, this.props.match.params.entity_id);
            if(!entity || (typeof entity.isMissingFields != 'undefined' && entity.isMissingFields())){
                setTimeout(() => {
                    AdminActions.getSingle(this.props.match.params.entity_slug, this.props.match.params.entity_id);
                }, 500);
            }

            this.setState({
                entity,
                mode: 'edit',
                entitySlug: this.props.match.params.entity_slug,
                entityComponent: require('./forms/'+this.getFormName()).default
            });
            this.storeUpdatedListener = store.subscribe(`manage_${this.props.match.params.entity_slug}`, this.storeUpdated.bind(this));
        }
        else{
            this.setState({
                mode: 'add',
                entitySlug: this.props.match.params.entity_slug,
                entityComponent: require('./forms/'+this.getFormName()).default
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

        else if(this.state.mode==='edit') AdminActions.update(this.state.entitySlug, data);
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
                <div className="container">
                {
                    (this.state.mode == 'edit') ?
                        <div className="mb-3 view-title">
                            <div className="float-right droplink-float-right">
                                {cards[this.state.entitySlug+'Card'](this.state.entity, cardActions.bind(this), <span className="btn btn-primary">actions</span>)}
                            </div>
                            <h2>Edit {this.state.entitySlug.charAt(0).toUpperCase() + this.state.entitySlug.slice(1)} (id:{this.state.entity.id})</h2>
                        </div>
                        :
                        <h2 className="mb-3 view-title">Add New {this.state.entitySlug.charAt(0).toUpperCase() + this.state.entitySlug.slice(1)}</h2>
                }
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