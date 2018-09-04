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

const sync = (type) => {
    return (result) => {
        Notify.success(`The ${type} was updated`);
        Flux.dispatchEvent(`manage_${type}`, AdminStore.replace(type, result.data || result));
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