import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import store from '../../store';
import { Modal } from '../../utils/react-components/src/index';
import { Notify } from 'bc-react-notifier';
import * as StudentActions from '../../actions/StudentActions';
import _BaseForm from './_BaseForm';
import validator from 'validator';

class Form extends _BaseForm{
    
    constructor(){
        super();
        this.state = {
            data: this.setDefaultState(),
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
        if(!d.cohort_slug || d.cohort_slug=='') return this.throwError('Please select a cohort');
        if(this.props.mode !== 'add'){
            if(validator.isEmpty(d.full_name)) return this.throwError('Missing the Full Name');
        } 
        else{
            if(validator.isEmpty(d.first_name)) return this.throwError('Missing the First Name');
            if(validator.isEmpty(d.last_name)) return this.throwError('Missing the Last Name');
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
                    <input type="checkbox" value={this.state.notifyStudent} onChange={(e) => this.setState({ notifyStudent: e.target.checked })} />
                    Run automation and notify student about his new cohort
                </Modal>
                {
                    (this.state.mode === 'add') ?
                        <Add data={this.state.data} studentCohorts={this.state.dependencies.cohort || []} 
                            formUpdated={this.formUpdated.bind(this)}
                        />
                    :
                        <Edit data={this.state.data} studentCohorts={this.state.data.cohorts || []} 
                            formUpdated={this.formUpdated.bind(this)}
                        />
                }
                <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                <button type="submit" className="btn btn-primary">Save</button>
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
                <input type="text" className="form-control" placeholder="Full Name"
                    value={data.full_name} 
                    onChange={(e) => formUpdated({ full_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="url" className="form-control" placeholder="Github URL (optional)"
                    value={data.github} 
                    onChange={(e) => formUpdated({ github: e.target.value})}
                />
            </div>
            <div className="form-group">
                <small className="text-danger mr-2">Actively looking for a job?</small>
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
                <small id="emailHelp" className="form-text text-muted">Student cohorts can be managed thru the cohort itself</small>
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
                <input type="url" className="form-control" placeholder="Github URL (optional)"
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
                    <option value={null}>Select a cohort</option>
                    {cohorts}
                </select>
                <small className="form-text text-muted">Initial cohort for the student</small>
            </div>
            <div className="form-group">
                <small className="text-danger mr-2">Will it be looking for a job?</small>
                <input
                    type="checkbox"
                    checked={data.seeking_job}
                    onChange={(e) => formUpdated({ seeking_job: e.target.checked})}
                />
            </div>
        </div>
    );
};

export default withRouter(Form);