import BC from '../utils/api/index';
import Flux from '@4geeksacademy/react-flux-dash';
import AdminStore from '../stores/AdminStore';
import * as Notify from '../actions/NotifyActions';

export const addStudentsToCohort = (cohort_slug, studentsArray) => {
    BC.cohort().addStudents(cohort_slug, studentsArray)
        .then((result) => {
            Notify.success(`The cohort was successfully added to the student`);
            
            let state = AdminStore.getState();
            let entities = state[`manage_student`].map((student) => {
                if(studentsArray.indexOf(student.id) !== -1){
                    student.cohorts.push(cohort_slug);
                }
                return student;
            })
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
            
            let state = AdminStore.getState();
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