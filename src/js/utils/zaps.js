import React from 'react';
import EventEmitter from 'events';
import PropTypes from 'prop-types';
import { Dispatcher } from 'flux';
import BC from '../utils/api.js';

const dispatcher = new Dispatcher();

//retrieve all zaps from API
export const fetchZaps = () => {
    return BC.zap().all().then((result) => dispatcher.dispatch({ type: 'zaps', data: result.data || result }));
};

const remove = (id) =>{
    dispatcher.dispatch({ type: 'zap_actions', data: store.getActions().filter(a => a.id != id) });
};

const execute = (action, payload=null, onFinish=null) =>{
    
    if(typeof action.slug === 'undefined') throw new Error('Missing zap slug');
    
    let actions = store.getActions();
    if(!actions) actions = [];
    
    const actionId = Math.floor(Math.random() * 100000000000);
    let _action = {
        id: actionId,
        payload: payload,
        title: action.title || action.slug,
        slug: action.slug,
        status: null,
        onFinish: onFinish,
        remove: () => remove(actionId)
    };
    
    dispatcher.dispatch({ type: 'zap_actions', data: actions.concat([_action]) });
    
    BC.zap().execute(action.slug, payload)
        .then(() => {
            let actions = store.getActions();
            dispatcher.dispatch({ 
                type: 'zap_actions', 
                data: actions.map(a => {
                    if(a.slug == action.slug) a.status = 'success';
                    return a;
                })
            });
        })
        .catch((e) => {
            let actions = store.getActions();
            dispatcher.dispatch({ 
                type: 'zap_actions', 
                data: actions.map(a => {
                    if(a.slug == action.slug){
                        a.status = 'error';
                        a.error = e;
                    } 
                    return a;
                })
            });
        });
    
    return action;
};

const clean = () => dispatcher.dispatch([]);

/**
 *      Components
 **/

let ActionCard = (props) => { 
    return (
        <div className={'zapAction '+props.typeClass} onClick={() => props.onClick ? props.onClick() : null}>
            <span className="mr-2">
                { (props.action.status === null) ? 
                    <i class="fas fa-sync fa-spin"></i> 
                    : (props.action.status === 'success') ? 
                        <i class="fas fa-check text-success"></i>
                        : (props.action.status === 'error') ? 
                            <i class="fas fa-times text-danger"></i>
                            : <i class="fas fa-question text-warning"></i>
                }
            </span>
            <span>
                {props.action.title || "No title for the action"}
            </span>
        </div>
    );
};
ActionCard.propTypes = {
  action: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  typeClass: PropTypes.string
};


/**
 *      Store
 **/
class ZapStore extends EventEmitter{
    constructor(){
        super();
        this.zaps = [];
        this.actions = [{
            id: 1,
            payload: {},
            title: "Something is being exercuted",
            slug: "bliblibli",
            status: null
        }];
        dispatcher.register((event) => {
            if(event.type == 'zaps'){
                this.zaps = event.data;
                this.emit('zaps_updated', this.zaps);
            } 
            else if(event.type == 'zap_actions'){
                this.actions = event.data;
                this.emit('zaps_actions_updated', this.actions);
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
const store = new ZapStore();

export class ZapActionRenderer extends React.Component{

    constructor(){
      super();
      this.state = {
        actions: [],
        collapsed: false
      };
      this.zapActionsUpdated = (actions) => {
          this.setState({ actions });
      };
    }
    
    componentDidMount(){
        this.setState({ actions: store.getActions() });
        store.on('zap_actions_updated', this.zapActionsUpdated);
    }
    
    componentWillUnmount(){
        store.removeListener('zap_actions_updated', this.zapActionsUpdated);
    }
    
    render(){
        return(<div className={"bc_zaps "+(this.state.collapsed ? "collapsed" : "")+this.props.className}>
            <button onClick={() => this.setState({ collapsed: !this.state.collapsed})}><i class="fas fa-minus-square"></i></button>
            { this.state.actions.length == 0 || this.state.collapsed ?  
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

export const ZapManager = { clean, execute, remove, getZapActions: (slug) => store.getZapActions(slug) };