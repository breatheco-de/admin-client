import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import store from '../../store';
import { Modal } from '../../utils/react-components/src/index';
import { Notify } from 'bc-react-notifier';
import * as StudentActions from '../../actions/StudentActions';
import _BaseForm from './_BaseForm.js';
import validator from 'validator';

class Form extends _BaseForm{

    constructor(){
        super();
        const data = this.setDefaultState();
        this.state = {
            data,
            addCohort: null,
            newCohort: null,
            notifyStudent: false,
            dependencies: {
                cohort: store.getAll('cohort'),
            }
        };
    }

    setDefaultState(){
        return {
            username: '',
            email: '',
            id: null,
            type: 'student',
            first_name: '',
            last_name: '',
            phone: '',
            github: '',
            cohort_slug: ''
        };
    }

    formUpdated(newFormData){
        if(typeof newFormData.addCohort !== 'undefined'){
            this.setState({ addCohort: newFormData.addCohort });
        }
        else{
            let data = Object.assign(this.state.data, newFormData);
            this.setState({ data });
        }
    }

    validate(){
        const d = this.state.data;
        if(!validator.isEmail(d.email)) return this.throwError('Missing the Email');
        if(validator.isEmpty(d.phone)) return this.throwError('Missing phone number');
        if(!validator.isMobilePhone(d.phone,'any')) return this.throwError('Invalid phone number');
        if(validator.isEmpty(d.first_name)) return this.throwError('Missing the First Name');
        if(validator.isEmpty(d.last_name)) return this.throwError('Missing the Last Name');
        if(this.props.mode === 'add'){
            if(!d.cohort_slug || d.cohort_slug=='') return this.throwError('Please select a cohort');
        }

        return true;
    }

    sanitizeData(data){
        if(this.state.mode === 'add'){
            const cohort = store.getSingleBy('cohort', 'slug', this.state.data.cohort_slug);
            data.profile_slug = cohort.profile_slug;
        }
        return data;
    }

    addToCohort(){
        if(!this.state.newCohort) Notify.error("Invalid cohort");
        else{
            StudentActions.addStudentsToCohort(this.state.newCohort, this.state.data.id, this.state.notifyStudent);
            this.setState({
                addCohort: null,
                newCohort: null
            });
        }
    }

    render(){
        const cohorts = this.state.dependencies.cohort.map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>));
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <Modal show={this.state.addCohort} title="Add student to cohort"
                    onSave={this.addToCohort.bind(this)}
                    onCancel={() => this.setState({
                        addCohort: null,
                        newCohort: null
                    })}
                >
                    <select className="form-control" onChange={(e) => {
                        this.setState({ newCohort: e.target.value });
                    }}>
                        <option value={null}>Select a cohort</option>
                        {cohorts}
                    </select>
                </Modal>
                {
                    (!this.state.mode || typeof this.state.mode == 'undefined' ||  this.state.mode === 'add') ?
                        <Add data={this.state.data} studentCohorts={this.state.dependencies.cohort || []}
                            formUpdated={this.formUpdated.bind(this)}
                        />
                    :
                        <Edit data={this.state.data} studentCohorts={this.state.data.cohorts || []}
                            formUpdated={this.formUpdated.bind(this)}
                        />
                }
                <div class="row mt-3">
                    <div class="col">
                        <button type="button" className="btn btn-dark btn-lg w-100" onClick={() => this.props.history.goBack()}>Back</button>
                    </div>
                    <div class="col">
                        <button type="submit" className="btn btn-primary  btn-lg w-100">Save</button>
                    </div>
                </div>
            </form>
        );
    }
}

const Edit = ({data, studentCohorts, formUpdated}) => {
    const cohorts = studentCohorts.map((c,i) => (
        <li key={i} className="nav-item mr-3">
            <Link to={`/manage/cohort/?slug=${c}`} className="mr-2">
                {c}
            </Link>
            <a href="#" onClick={() => StudentActions.removeStudentsFromCohort(c, [data.id])}><i className="fas fa-trash-alt fa-xs"></i></a>
        </li>
    ));
    return (
        <div>
            <div className="form-group">
                <input type="email" className="form-control" placeholder="Email"
                    value={data.email}
                    readOnly={true}
                />
                <small className="form-text text-muted">The email cannot be changed</small>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="First Name"
                    value={data.first_name || data.full_name}
                    onChange={(e) => formUpdated({ first_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Last Name"
                    value={data.last_name}
                    onChange={(e) => formUpdated({ last_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Github Username (optional)"
                    value={data.github}
                    onChange={(e) => formUpdated({ github: e.target.value})}
                />
            </div>
            <h5>Job Related Information</h5>
            <div className="bg-light p-2">
                <div className="form-group">
                    <small className="text-danger mr-2">Actively looking for a job?</small>
                    <input
                        type="checkbox"
                        checked={data.seeking_job}
                        onChange={(e) => formUpdated({ seeking_job: e.target.checked})}
                    />
                </div>
            </div>
            <div className="form-group">
                <small className="text-danger mr-2">Include into Active Campaign?</small>
                <input
                    type="checkbox"
                    checked={data.seeking_job}
                    onChange={(e) => formUpdated({ seeking_job: e.target.checked})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Phone Number"
                    value={data.phone}
                    onChange={(e) => formUpdated({ phone: e.target.value})}
                />
            </div>
            <div className="form-group">
                <ul className="nav">
                    {cohorts}
                    <li className="nav-item">
                        <button type="button" className="btn btn-light"
                            onClick={() => formUpdated({ addCohort: true })}
                        >
                            <i className="fas fa-plus-circle"></i> Add cohort
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};
const Add = ({data, studentCohorts, formUpdated}) => {
    const cohorts = studentCohorts.concat().sort().map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>));
    return (
        <div>
            <div className="form-group">
                <input type="email" className="form-control"  placeholder="Email"
                    value={data.email}
                    onChange={(e) => formUpdated({ email: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="First Name"
                    value={data.first_name}
                    onChange={(e) => formUpdated({ first_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Last Name"
                    value={data.last_name}
                    onChange={(e) => formUpdated({ last_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="url" className="form-control" placeholder="Github username (optional)"
                    value={data.github}
                    onChange={(e) => formUpdated({ github: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Phone Number"
                    value={data.phone}
                    onChange={(e) => formUpdated({ phone: e.target.value})}
                />
            </div>
            <div className="form-group">
                <select className="form-control"
                    onChange={(e) => formUpdated({ cohort_slug: e.target.value})}
                >
                    <option value={null}>What will be his initial cohort?</option>
                    {cohorts}
                </select>
            </div>

            <h5>Job Related Information</h5>
            <div className="bg-light p-2">
                <div className="form-group">
                    <small className="text-danger mr-2">Will it be looking for a job?</small>
                    <input
                        type="checkbox"
                        checked={data.seeking_job}
                        onChange={(e) => formUpdated({ seeking_job: e.target.checked})}
                    />
                </div>
            </div>
        </div>
    );
};

export default withRouter(Form);