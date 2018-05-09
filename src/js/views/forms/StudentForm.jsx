import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import AdminStore from '../../stores/AdminStore';
import { Modal } from '../../utils/bc-components/index';
import * as StudentActions from '../../actions/StudentActions';
import _BaseForm from './_BaseForm';
import validator from 'validator';

class Form extends _BaseForm{
    
    constructor(){
        super();
        this.state = {
            data: null,
            addCohort: null,
            newCohort: null,
            allCohorts: AdminStore.getAll('cohort')
        };
    }
    
    componentWillMount(){
        if(this.props.mode=='add'){
            this.setState({
                data: {
                    username: '',
                    email: '',
                    id: null,
                    type: 'student',
                    phone: '',
                    github: '',
                    cohort_slug: ''
                },
                mode: this.props.mode
            });
        }
        else{
            this.setState({
                data: this.props.data,
                mode: this.props.mode
            });
        }
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
        if(validator.isEmpty(d.full_name)) return this.throwError('Missing the Full Name');
        if(!validator.isEmail(d.email)) return this.throwError('Missing the Email');
        if(validator.isEmpty(d.phone || '')) return this.throwError('Missing phone number');
        
        return true;
    }
    
    addToCohort(){
        StudentActions.addStudentsToCohort(this.state.newCohort, [this.state.data.id]);
        this.setState({
            addCohort: null,
            newCohort: null
        });
    }
    
    render(){
        const cohorts = this.state.allCohorts.map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>));
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <Modal show={this.state.addCohort} title="Add student to cohort"
                    onSave={this.addToCohort.bind(this)}
                    onCancel={() => this.setState({
                        addCohort: null,
                        newCohort: null
                    })}
                >
                    <select onChange={(e) => this.setState({ newCohort: e.target.value })}>
                        {cohorts}
                    </select>
                </Modal>
                {
                    (this.state.mode === 'add') ?
                        <Add data={this.state.data} studentCohorts={this.state.allCohorts || []} 
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
    const cohorts = studentCohorts.map((c,i) => (<li key={i} className="nav-item"><Link to={`/manage/cohort/?slug=${c}`} className="nav-link">{c}</Link></li>));
    return (
        <div>
            <div className="form-group">
                <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email"
                    value={data.email} 
                    readOnly={true}
                />
                <small className="form-text text-muted">The email cannot be changed</small>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Full Name"
                    value={data.full_name} 
                    onChange={(e) => formUpdated({ full_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="url" className="form-control" placeholder="Github URL"
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
    const cohorts = studentCohorts.map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>));
    return (
        <div>
            <div className="form-group">
                <input type="email" className="form-control"  aria-describedby="emailHelp" placeholder="Email"
                    value={data.email} 
                    onChange={(e) => formUpdated({ email: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Full Name"
                    value={data.full_name} 
                    onChange={(e) => formUpdated({ full_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <select className="form-control"
                    onChange={(e) => formUpdated({ cohort_slug: e.target.value})}
                >
                    {cohorts}
                </select>
                <small className="form-text text-muted">Initial cohort for the student</small>
            </div>
        </div>
    );
};

export default withRouter(Form);