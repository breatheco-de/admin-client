import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm';
import validator from 'validator';
import store from '../../store';
import moment from 'moment';
import {cohortActions} from '../../actions/CustomActions.js';
class Form extends _BaseForm{
    
    constructor(){
        super();
        this.state = {
            data: this.setDefaultState(),
            dependencies: {
                location: store.getAll('location'),
                user: store.getAll('user', (user) => user.type == 'teacher'),
                profile: store.getAll('profile')
            },
        };
    }
    
    setDefaultState(){
        return {
            id: null,
            slug: '',
            profile_slug: '',
            slack_url: 'https://4geeksacademy.slack.com',
            kickoff_date: '',
            ending_date: '',
            language: '',
            teachers: []
        };
    }
    
    validate(data){
        if(validator.isEmpty(data.kickoff_date)) return this.throwError('Empty kickoff date');
        if(validator.isEmpty(data.ending_date)) return this.throwError('Empty kickoff date');
        if(validator.isEmpty(data.name)) return this.throwError('Empty slug');
        if(validator.isEmpty(data.language)) return this.throwError('Empty slug language');
        if(validator.isEmpty(data.slack_url)) return this.throwError('Empty slack_url');
        if(validator.isEmpty(data.profile_slug)) return this.throwError('Empty profile_slug');
        
        if(moment(data.ending_date).isBefore(moment(data.kickoff_date))) return this.throwError('The ending date needs to be after the starting date');
        
        return true;
    }
    
    sanitizeData(data){
        if(typeof data.slug !== 'undefined' && (!data.slug || data.slug=='')){
            data.slug = data.name.replace(/\s+/g, '-').toLowerCase();
        }
        return data;
    }
    
    render(){
        const profiles = this.state.dependencies.profile.map((p,i) => (<option key={i} value={p.slug}>{p.name}</option>));
        const locations = this.state.dependencies.location.map((p,i) => (<option key={i} value={p.slug}>{p.name}</option>));
        const cohortTeachers = this.state.data.teachers.map((t,i) => (
            <li key={i} className="nav-item mr-3">
                {t.full_name} {t.pivot && t.pivot.is_instructor ? '(main)' : '(assistant)'} <a href="#" onClick={(data) => cohortActions.delete_teacher(this.state.data, t)}><i className="fas fa-trash-alt fa-xs"></i></a>
            </li>
        ));
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group bg-light p-2">
                    <ul className="nav">
                        <strong>Teachers:</strong>{cohortTeachers.length ? cohortTeachers : 'No assigned teachers'}
                        <li className="nav-item">
                            <button type="button" className="btn btn-light btn-sm"
                                onClick={() => cohortActions.add_teacher(this.state.data)}
                            >
                                <i className="fas fa-plus-circle"></i> Add teacher
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Cohort Name"
                        value={this.state.data.name}
                        onChange={(e) => this.formUpdated({ name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="slug"
                        value={this.state.data.slug} 
                        onChange={(e) => this.formUpdated({ slug: this.slugify(e.target.value)})}
                        readOnly={(this.props.mode !== 'add')}
                    />
                    {
                        (this.props.mode !== 'add') ?
                            <small id="emailHelp" className="form-text text-muted">The slug cannot be changed</small>
                        :
                        <small id="emailHelp" className="form-text text-info">Leave slug empty for automatic generation</small>
                    }
                </div>
                <div className="form-group">
                    <input type="url" className="form-control" placeholder="slack url"
                        value={this.state.data.slack_url} 
                        onChange={(e) => this.formUpdated({ slack_url: e.target.value})}
                    />
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <small className="form-text text-info">Starting</small>
                            <input type="date" className="form-control" placeholder="kickoff_date"
                                value={this.state.data.kickoff_date} 
                                onChange={(e) => this.formUpdated({ kickoff_date: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <small className="form-text text-info">Ending</small>
                            <input type="date" className="form-control" placeholder="ending_date"
                                value={this.state.data.ending_date} 
                                onChange={(e) => this.formUpdated({ ending_date: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <select className="form-control"
                        value={this.state.data.language}
                        onChange={(e) => this.formUpdated({ language: e.target.value})}>
                        <option value={null}>select a language</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
                <div className="form-group">
                    <select className="form-control"
                        value={this.state.data.location_slug}
                        onChange={(e) => this.formUpdated({ location_slug: e.target.value})}>
                        <option value={null}>select a location</option>
                        {locations}
                    </select>
                </div>
                <div className="form-group">
                    <select className="form-control"
                        value={this.state.data.profile_slug}
                        onChange={(e) => this.formUpdated({ profile_slug: e.target.value})}>
                        <option value={null}>select a profile</option>
                        {profiles}
                    </select>
                </div>
                <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        )
    }
}
export default withRouter(Form);