import React from 'react';
import BC from '../utils/api.js';
import Flux from '@4geeksacademy/react-flux-dash';
import store from '../store';
import { Notify } from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import {logout} from '../utils/react-components/src/index';
import { ZapManager } from '../utils/zaps';

BC.setOptions({
    getToken: (type='api')=> {
        const session = Session.store.getSession();
        if(type=='assets') 
            return (session.user) ? 'JWT '+session.user.assets_token:'';
        else return 'Bearer '+session.access_token;
    },
    onLogout: () => logout()
});

const sync = (type, mode='replace') => {
    return (result) => {
        Notify.success(`The ${type} was updated`);
        if(typeof store[mode] != 'function') throw new Error('Invalid mode '+mode+' for custom event of '+type);
        Flux.dispatchEvent(`manage_${type}`, store[mode](type, result.data || result));
    };
};

class _PickCohortStage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            stage: null,
            actions: []
        };
    }
    render(){
        return (<div>
            { !this.state.stage ?
                <div>
                    Choose your new stage:
                    { store.getCatalog('cohort_stages').map((c,i) => (
                        <a key={i} className="btn btn-light" onClick={() => this.setState({ 
                            stage: c.value,
                            actions: ZapManager.getZapActions('change_cohort_status@'+c.value).map(a => Object.assign(a, {checked: true}))
                        })}>{c.label}</a>
                    )) }
                </div>
                :
                <div className="row">
                    <div className="col-12">This action will have the following additional consequences on the system:</div>
                    <ul className="col-11 col-sm-8 col-md-6 mx-auto bg-light mb-3">
                    { this.state.actions.length ? 
                        this.state.actions.map((action,i) => (
                            <li key={i}>
                                <input type="checkbox" checked={action.checked}
                                    onChange={() => this.setState({ 
                                        actions: this.state.actions.map(a => a.slug !== action.slug ? a : Object.assign(a, {checked: !a.checked}))
                                    })} 
                                />{action.title}
                            </li>
                        ))
                        : 
                        <li>No additional consequences.</li>
                    }
                    </ul>
                    <div className="col-12">
                        <button className="btn btn-secondary mr-2" onClick={() => this.props.onConfirm(null)}>Cancel</button>
                        <button className="btn btn-success" onClick={() => this.props.onConfirm({ 
                            stage: this.state.stage,
                            actions: this.state.actions.filter(a => a.checked)
                        })}>Continue</button>
                    </div>
                </div>
            }
        </div>);
    }
}
export const cohortActions = {
    _type: 'cohort',
    change_stage: function(data){ 
        Notify.info(_PickCohortStage, (conf) => conf === null ? Notify.clean() :
            Notify.add("Are you sure? The new stage is: "+conf.stage, (answer) => {
                Notify.clean();
                if(answer){
                    // @TODO: Zaps should be executed after the cohort was successfully updated
                    //BC.cohort().update(data.cohort.id, { stage: conf.stage }).then(sync(this._type));
                    conf.actions.forEach(a => ZapManager.execute(a, { cohort_slug: data.cohort.slug }));
                    return true;
                }
                return false;
            })
        ,99999999);
    }
};

const _StudentStatusChooser = ({onConfirm}) => (
    <div>
        Choose the student new status:
        { store.getCatalog('student_status').map((c,i) => (
            <a key={i} className="btn btn-light" onClick={() => onConfirm(c.slug)}>{c.label}</a>
        )) }
    </div>
);
const _StudentJobStatusChooser = ({onConfirm}) => (
    <div>
        Choose the student hired status:
        <a className="btn btn-light" onClick={() => onConfirm(1)}>Hired</a>
        <a className="btn btn-light" onClick={() => onConfirm(0)}>Not yet hired</a>
    </div>
);
const _StudentFinantialStatusChooser = ({onConfirm}) => (
    <div>
        Choose the student finantial status:
        { store.getCatalog('finantial_status').map((c,i) => (
            <a key={i} className="btn btn-light" onClick={() => onConfirm(c.slug)}>{c.label}</a>
        )) }
    </div>
);
export const studentActions = {
    _type: 'student',
    change_breathecode_status: function(data){ 
        Notify.info(_StudentStatusChooser, (newStage) =>
            Notify.info("Are you sure you want to change to "+newStage+"? ", (answer) => {
                Notify.clean();
                if(answer){
                    BC.student().setStatus(data.student.id, { status: newStage }).then(sync(this._type));
                }
            })
        );
    },
    change_hired_status: function(data){ 
        Notify.info(_StudentJobStatusChooser, (newStatus) =>
            Notify.info("Are you sure you want to change the status?", (answer) => {
                Notify.clean();
                if(answer){
                    BC.student().update(data.student.id, { found_job: newStatus }).then(sync(this._type));
                }
            })
        );
    },
    change_finantial_status: function(data){ 
        Notify.info(_StudentFinantialStatusChooser, (newStatus) =>
            Notify.info("Are you sure you want to change the status to "+newStatus+"?", (answer) => {
                Notify.clean();
                if(answer){
                    BC.student().update(data.student.id, { financial_status: newStatus }).then(sync(this._type));
                }
            })
        );
    }
};

export const eventActions = {
    _type: 'event',
    duplicate_event: function(data){ 
        Notify.info("Are you sure you want to duplicate this event? ", () => {
            let newEvent = Object.assign({},data.event);
            newEvent.id = null, 
            newEvent.title = data.event.title+' (Copy)',
            newEvent.status = 'draft';
            BC.event().add(newEvent).then(sync(this._type, 'add'));
        });
    }
};