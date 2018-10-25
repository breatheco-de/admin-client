import React from 'react';
import BC from '../utils/api.js';
import Flux from '@4geeksacademy/react-flux-dash';
import AdminStore from '../stores/AdminStore';
import { Notify } from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import {logout} from '../utils/react-components/src/index';

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
        if(typeof AdminStore[mode] != 'function') throw new Error('Invalid mode '+mode+' for custom event of '+type);
        Flux.dispatchEvent(`manage_${type}`, AdminStore[mode](type, result.data || result));
    };
};


const _StatusChooser = ({onConfirm}) => (
    <div>
        Choose your new stage
        {   ['not-started', 'on-prework', 'on-course','on-final-project','finished'].map(stage => 
                (<a key={stage} className="btn btn-light"
                    onClick={() => onConfirm(stage)}>
                        {stage}
                </a>)
            )
        }
    </div>
);
export const cohortActions = {
    _type: 'cohort',
    change_stage: function(data){ 
        Notify.info(_StatusChooser, (newStage) =>
            Notify.info("Are you sure? The new stage is: "+newStage, (answer) => {
                Notify.clean();
                if(answer){
                    BC.cohort().update(data.cohort.id, { stage: newStage }).then(sync(this._type));
                }
            })
        );
    }
};

const _StudentStatusChooser = ({onConfirm}) => (
    <div>
        Choose the student new status:
        {   ['currently_active', 'under_review', 'blocked', 'studies_finished', 'student_dropped'].map(stage => 
                (<a key={stage} className="btn btn-light"
                    onClick={() => onConfirm(stage)}>
                        {stage}
                </a>)
            )
        }
    </div>
);
export const studentActions = {
    _type: 'student',
    change_breathecode_status: function(data){ 
        Notify.info(_StudentStatusChooser, (newStage) =>
            Notify.info("Are you sure you want to change to this status? "+newStage, (answer) => {
                Notify.clean();
                if(answer){
                    BC.student().setStatus(data.student.id, { status: newStage }).then(sync(this._type));
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