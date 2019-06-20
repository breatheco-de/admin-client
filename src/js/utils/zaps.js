import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import EventEmitter from 'events';
import PropTypes from 'prop-types';
import { Dispatcher } from 'flux';
import BC from '../utils/api.js';

const ACTIONS_UPDATED = 'actions_updated';
const ZAPS_UPDATE = 'zaps_update';
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
                for( let zap_slug in this.zaps){
                    this.zaps[zap_slug] = this.zaps[zap_slug].map(a => Object.assign(a, { checked: a.run_by_default || false }));
                }
                this.emit(ZAPS_UPDATE, this.zaps);
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
        .then((data) => {
            let actions = _store.getActions();
            dispatcher.dispatch({
                type: 'zap_actions',
                data: actions.map(a => {
                    if(a.id == actionId){
                        a.status = 'success';
                        a.ended_at = new Date();
                        a.details = data.msg || data;
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
                        a.details = e.msg || e;
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
                            <Tooltip content={props.action.details}>({props.action.getDelta()} seconds)</Tooltip>
                        </span>
                        : (props.action.status === 'error') ?
                            <span>
                                <i className="fas fa-times text-danger mr-2"></i>
                                <Tooltip content={props.action.details}>({props.action.getDelta()} seconds)</Tooltip>
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
        zaps: [],
        collapsed: true
      };
      this.zapActionsUpdated = (actions) => {
          const isPending = actions.find(a => !a.status) !== 'undefined';
          this.setState({ actions, collapsed: !isPending });
      };
      this.zapsUpdated = (zaps) => {
          this.setState({ zaps });
      };
    }

    componentDidMount(){
        this.setState({ actions: _store.getActions() });
        _store.on(ACTIONS_UPDATED, this.zapActionsUpdated);
        _store.on(ZAPS_UPDATE, this.zapsUpdated);
    }

    componentWillUnmount(){
        _store.removeListener(ACTIONS_UPDATED, this.zapActionsUpdated);
        _store.removeListener(ZAPS_UPDATE, this.zapsUpdated);
    }

    render(){
        return(<div className={"bc_zaps "+(this.state.collapsed ? "collapsed" : "")+this.props.className}>
            <button onClick={() => this.setState({ collapsed: !this.state.collapsed})}><i className="fas fa-minus-square"></i></button>
            {(_store.getZaps().length===0 && this.state.zaps.length == 0) ?
                <div className="alert alert-danger p-1">The zap engine does not seem to be loading correctly</div>
                :
                (this.state.actions.length == 0 || this.state.collapsed) ?
                    <p>No actions to show from [{this.state.zaps.length}] zaps loaded.</p>
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

export default class Tooltip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.styles = {
        wrapper: {
            position: 'relative',
            display: 'inline-block',
            zIndex: '98',
            color: '#555',
            cursor: 'help',
        },
        tooltip: {
            position: 'absolute',
            zIndex: '99',
            minWidth: '200px',
            maxWidth: '420px',
            background: '#000',
            bottom: '100%',
            left: '50%',
            marginBottom: '10px',
            padding: '5px',
            WebkitTransform: 'translateX(-50%)',
            msTransform: 'translateX(-50%)',
            OTransform: 'translateX(-50%)',
            transform: 'translateX(-50%)',
        },
        content: {
            background: '#000',
            color: '#fff',
            display: 'inline',
            fontSize: '.8em',
            padding: '.3em 1em',
        },
        arrow: {
            position: 'absolute',
            width: '0',
            height: '0',
            bottom: '-5px',
            left: '50%',
            marginLeft: '-5px',
            borderLeft: 'solid transparent 5px',
            borderRight: 'solid transparent 5px',
            borderTop: 'solid #000 5px',
        },
        gap: {
            position: 'absolute',
            width: '100%',
            height: '20px',
            bottom: '-20px',
        }
    };
    if (props.styles) this.mergeStyles(props.styles);
  }

  mergeStyles(userStyles){
    Object.keys(this.styles).forEach((name) => {
      Object.assign(this.styles[name], userStyles[name]);
    });
  }

  setVisibility(visible){
    this.setState(Object.assign({}, this.state, {
      visible,
    }));
  }

  assignOutsideTouchHandler(){
    const handler = (e) => {
      let currentNode = e.target;
      const componentNode = ReactDOM.findDOMNode(this.refs.instance);
      while (currentNode.parentNode) {
        if (currentNode === componentNode) return;
        currentNode = currentNode.parentNode;
      }
      if (currentNode !== document) return;
      this.setVisibility(false);
      document.removeEventListener('touchstart', handler);
    };
    document.addEventListener('touchstart', handler);
  }

  render() {
    const {props, state, styles} = this;
    return (
      <div
        onMouseEnter={() => this.setVisibility(true)}
        onMouseLeave={() => this.setVisibility(false)}
        onTouchStart={() => {
            this.show();
            this.assignOutsideTouchHandler();
        }}
        ref="wrapper"
        style={styles.wrapper}>
        {props.children}
        {
          state.visible &&
          <div ref="tooltip" style={styles.tooltip}>
            <div ref="content" style={styles.content}>{props.content}</div>
            <div ref="arrow" style={styles.arrow} />
            <div ref="gap" style={styles.gap} />
          </div>
        }
      </div>
    );
  }
}
Tooltip.propTypes = {
    children: PropTypes.any.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    styles: PropTypes.object,
};

export const ModalZapPicker = ({ actions, onConfirm }) => {

    const [ checkedActions, setCheckedActions ] = useState(actions);
    return <div className="row">
        <div className="col-12">
            <p>What else should happen after this?</p>
        { (typeof checkedActions == 'undefined' || checkedActions.length == 0) ?
            <ul><li>No additional consequences.</li></ul>
            :
            <ul>
                { checkedActions.map((action,i) => (
                    <li key={i}>
                        <input type="checkbox" className="mr-1" checked={action.checked}
                            onChange={() => {
                                const newActions = actions.map(a => a.slug !== action.slug ? a : Object.assign(a, {checked: !a.checked}));
                                setCheckedActions(newActions);
                            }}
                        />{action.title}
                    </li>))
                }
            </ul>
        }
        </div>
        <div className="col-12">
            <button className="btn btn-secondary mr-2" onClick={() => onConfirm(null)}>Cancel</button>
            <button className="btn btn-success" onClick={() => onConfirm({
                actions: checkedActions.filter(a => a.checked)
            })}>Continue</button>
        </div>
    </div>;
}