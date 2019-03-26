import BC from '../utils/api.js';
import Flux from '@4geeksacademy/react-flux-dash';
import store from '../store';
import { Notify } from 'bc-react-notifier';
import {Session} from 'bc-react-session';
import {logout} from '../utils/react-components/src/index';

BC.setOptions({
    getToken: (type='api')=> {
        const payload = Session.getPayload();
        if(type=='assets') 
            return (payload) ? 'JWT '+payload.assets_token:'';
        else return 'Bearer '+payload.access_token;
    },
    onLogout: () => logout()
});

export const addStudentsToCohort = (cohort_slug, student_id, notify_student=true) => {
    if(notify_student) Notify.info("Are you sure? Several emails will be sent to the student", (answer) => {
        if(answer){
                BC.cohort().addStudentsWithAC(cohort_slug, student_id)
                    .then((result) => {
                        Notify.success(`The cohort was successfully added to the student`);
                        
                        let state = store.getState();
                        let entities = state[`manage_student`].map((student) => {
                            if(student_id == student.id){
                                student.cohorts.push(cohort_slug);
                            }
                            return student;
                        });
                        Flux.dispatchEvent(`manage_student`, entities);
                    })
                    .catch((error) => {
                        Notify.error(`Error: ${error.msg || error}`);
                    });
        }
        Flux.dispatchEvent("notifications", []);
    });
    
    else BC.cohort().addStudents(cohort_slug, [student_id])
                        .then((result) => {
                            Notify.success(`The cohort was successfully added to the student`);
                            
                            let state = store.getState();
                            let entities = state[`manage_student`].map((student) => {
                                if(student_id == student.id){
                                    student.cohorts.push(cohort_slug);
                                }
                                return student;
                            });
                            Flux.dispatchEvent(`manage_student`, entities);
                        })
                        .catch((error) => {
                            Notify.error(`Error: ${error.msg || error}`);
                        });
};

export const removeStudentsFromCohort = (cohort_slug, studentsArray) => {
    BC.cohort().removeStudents(cohort_slug, studentsArray)
        .then((result) => {
            Notify.success(`The cohort was successfully removed from the student`);
            
            let state = store.getState();
            let entities = state[`manage_student`].map((student) => {
                if(studentsArray.indexOf(student.id) !== -1){
                    student.cohorts = student.cohorts.filter((cohort) => cohort!=cohort_slug);
                }
                return student;
            });
            Flux.dispatchEvent(`manage_student`, entities);
        })
        .catch((error) => {
            Notify.error(`Error: ${error.msg || error}`);
        });
};