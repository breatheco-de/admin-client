import React from 'react';
import EventEmitter from 'events';
import PropTypes from 'prop-types';
import { Dispatcher } from 'flux';
import BC from '../utils/api.js';
const ACTIONS_UPDATED = 'audted';
const dispatcher = new Dispatcher();

//retrieve all zaps from API
export const fetchZaps = () => {
    return BC.zap().all().then((result) => dispatcher.dispatch({ type: 'zaps', data: result.data || result }));
};

/**
 *      Store
 **/
class ZapStore extends EventEmitter{
    constructor(){
        super();
        this.zaps = [];
        this.actions = [];
        dispatcher.register((event) => {
            if(event.type == 'zaps'){
                this.zaps = event.data;
                this.emit('zaps_updated', event.data);
            } 
            else if(event.type == 'zap_actions'){
                this.actions = event.data;
                this.emit(ACTIONS_UPDATED, event.data);
            } 
        });
    }
    
    getZaps(){
        return this.zaps || [];
    }
    getActions(){
        return this.actions || [];
    }
    getZapActions(slug=null){
        if(!this.zaps) throw new Error('There are no zaps, check the request from the network');
        return this.zaps[slug] || [];
    }
}
const _store = new ZapStore();

const execute = (action, payload=null, onFinish=null) =>{
    
    if(typeof action.slug === 'undefined') throw new Error('Missing zap slug');
    
    let actions = _store.getActions();
    if(!actions) actions = [];
    
    const actionId = Math.floor(Math.random() * 100000000000);
    let _action = {
        id: actionId,
        payload: payload,
        title: action.title || action.slug,
        slug: action.slug,
        status: null,
        started_at: new Date(),
        ended_at: null,
        onFinish: onFinish,
        getDelta: function(){
            if(!this.ended_at) return false;
            let delta = Math.abs(this.started_at.getTime() - this.ended_at.getTime()) / 1000;
            delta = Math.round(delta * 100) / 100;
            return delta;
        },
        remove: () => remove(actionId)
    };
    
    dispatcher.dispatch({ type: 'zap_actions', data: actions.concat([_action]) });
    
    BC.zap().execute(action.slug, payload)
        .then(() => {
            let actions = _store.getActions();
            dispatcher.dispatch({ 
                type: 'zap_actions', 
                data: actions.map(a => {
                    if(a.id == actionId){
                        a.status = 'success';
                        a.ended_at = new Date();
                    } 
                    return a;
                })
            });
        })
        .catch((e) => {
            let actions = _store.getActions();
            dispatcher.dispatch({ 
                type: 'zap_actions', 
                data: actions.map(a => {
                    if(a.id == actionId){
                        a.status = 'error';
                        a.ended_at = new Date();
                        a.error = e;
                    } 
                    return a;
                })
            });
        });
    
    return action;
};

const clean = () => dispatcher.dispatch([]);

const remove = (id) =>{
    dispatcher.dispatch({ type: 'zap_actions', data: _store.getActions().filter(a => a.id != id)});
};

/**
 *      Components
 **/

let ActionCard = (props) => { 
    return (
        <div className={'zapAction '+props.typeClass} onClick={() => props.onClick ? props.onClick() : null}>
            <span>
                {props.action.title || "No title for the action"}
            </span>
            <span className="ml-2">
                { (props.action.status === null) ? 
                    <i className="fas fa-sync fa-spin"></i> 
                    : (props.action.status === 'success') ? 
                        <span>
                            <i className="fas fa-check text-success mr-2"></i>
                            <small>({props.action.getDelta()} seconds)</small>
                        </span>
                        : (props.action.status === 'error') ? 
                            <span>
                                <i className="fas fa-times text-danger mr-2"></i>
                                <small>({props.action.getDelta()} seconds)</small>
                            </span>
                            : <i className="fas fa-question text-warning"></i>
                }
            </span>
        </div>
    );
};
ActionCard.propTypes = {
  action: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  typeClass: PropTypes.string
};


export class ZapActionRenderer extends React.Component{

    constructor(){
      super();
      this.state = {
        actions: [],
        collapsed: true
      };
      this.zapActionsUpdated = (actions) => {
          const isPending = actions.find(a => !a.status) !== 'undefined';
          this.setState({ actions, collapsed: !isPending });
      };
    }
    
    componentDidMount(){
        this.setState({ actions: _store.getActions() });
        _store.on(ACTIONS_UPDATED, this.zapActionsUpdated);
    }
    
    componentWillUnmount(){
        _store.removeListener(ACTIONS_UPDATED, this.zapActionsUpdated);
    }
    
    render(){
        return(<div className={"bc_zaps "+(this.state.collapsed ? "collapsed" : "")+this.props.className}>
            <button onClick={() => this.setState({ collapsed: !this.state.collapsed})}><i className="fas fa-minus-square"></i></button>
            {(_store.getZaps().length===0) ?
                <div className="alert alert-danger">The zap engine does not seem to be loading correctly</div>
                :
                (this.state.actions.length == 0 || this.state.collapsed) ?  
                    <p>No pending actions.</p>
                    :
                    this.state.actions.map((a, i) => (<ActionCard key={i} action={a} onClick={() => 
                        dispatcher.dispatch({ type: 'zap_actions', data: this.state.actions.filter(act => a.id !== act.id ) })
                    } />))
            }
        </div>);
    }
}
ZapActionRenderer.propTypes = {
  className: PropTypes.string
};
ZapActionRenderer.defaultProps = {
  className: ''
};

export const ZapManager = { clean, execute, remove, getZapActions: (slug) => _store.getZapActions(slug) };