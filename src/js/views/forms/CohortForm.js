import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm.js';
import validator from 'validator';
import store from '../../store';
import { CheckBox } from '../../utils/react-components/src/index';
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
                profile: store.getAll('profile'),
                syllabus: store.getAll('syllabus'),
                streaming: store.getAll('streaming')
            },
        };
    }

    setDefaultState(){
        return {
            id: null,
            slug: '',
            stage: "not-started",
            profile_slug: '',
            syllabus_slug: '',
            slack_url: 'https://4geeksacademy.slack.com',
            kickoff_date: '',
            ending_date: '',
            streaming_slug: '',
            meeting_url: null,
            current_day: 0,
            language: 'en',
            teachers: [],
            withStreaming: true
        };
    }

    validate(data){
        if(validator.isEmpty(data.kickoff_date)) return this.throwError('Empty kickoff date');
        if(validator.isEmpty(data.ending_date)) return this.throwError('Empty kickoff date');
        if(validator.isEmpty(data.name)) return this.throwError('Empty slug');
        if(validator.isEmpty(data.language)) return this.throwError('Empty slug language');
        if(validator.isEmpty(data.slack_url)) return this.throwError('Empty slack_url');
        if(validator.isEmpty(data.syllabus_slug)) return this.throwError('Please pick a syllabus for the cohort');
        if(validator.isEmpty(data.profile_slug)) return this.throwError('Empty profile_slug');
        if(data.stage !== "not-started" && data.current_day == 0) return this.throwError('Please specify the cohort current day information');
        if(data.withStreaming && validator.isEmpty(data.streaming_slug)) return this.throwError('The streaming slug is null but the cohort is marked for streaming');

        if(moment(data.ending_date).isBefore(moment(data.kickoff_date))) return this.throwError('The ending date needs to be after the starting date');

        return true;
    }

    sanitizeData(data){
        if(typeof data.slug !== 'undefined' && (!data.slug || data.slug=='')){
            data.slug = data.name.replace(/\s+/g, '-').toLowerCase();
        }

        if(!data.withStreaming) delete data.streaming_slug;
        if(data.stage === "not-started") delete data.current_day;

        return data;
    }

    render(){
        console.log("Teachers", this.state.data.teachers);
        const profiles = this.state.dependencies.profile.map((p,i) => (<option key={i} value={p.slug}>{p.name}</option>));
        const syllabus = this.state.dependencies.syllabus.filter(s => {
            if (!this.state.data.profile_slug || this.state.data.profile_slug === '') return false;
            const profile = s.slug.split('.')[0];
            if(profile !== this.state.data.profile_slug) return false;
            return true;
        }).map((p,i) => (<option key={i} value={p.slug}>{p.title} ({p.slug})</option>));
        const locations = this.state.dependencies.location.map((p,i) => (<option key={i} value={p.slug}>{p.name}</option>));
        const streamingCohortsHTML = this.state.dependencies.streaming.map((p,i) => (<option key={i} value={p.slug}>{p.slug}</option>));
        const cohortTeachers = this.state.data.teachers.map((t,i) => (
            <li key={i} className="nav-item mr-3">
                {t.full_name || `${t.first_name} ${t.last_name}`} {t.pivot && t.pivot.is_instructor ? '(main)' : '(assistant)'} <a href="#" onClick={(data) => cohortActions.delete_teacher(this.state.data, t)}><i className="fas fa-trash-alt fa-xs"></i></a>
            </li>
        ));
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                {
                    (this.props.mode !== 'add') &&
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
                }
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

                <h5>Additional Details</h5>
                <div className="bg-light p-2">
                    <div className="form-group">
                        <small className="mr-2">Syllabus version</small>
                        <select className="form-control"
                            value={this.state.data.syllabus_slug}
                            onChange={(e) => this.formUpdated({ syllabus_slug: e.target.value})}>
                            { (!this.state.data.profile_slug || this.state.data.profile_slug === '') ? 
                                <option value={null}>Select a profile first</option>
                                :
                                <option value={null}>Select a syllabus version</option>
                            }
                            {syllabus}
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Cohort day: </span>
                        </div>
                        {
                            this.state.data.stage !== "not-started" ?
                                <input type="number" className="form-control" placeholder="day number" value={this.state.data.current_day} onChange={(e) => this.formUpdated({ current_day: e.target.value})} />
                                :
                                <input type="number" className="form-control" placeholder="This cohort has not started yet" disabled={true} />

                        }
                    </div>
                </div>
                <div className="bg-light p-2">
                    <small className="mr-2">Online Room Information</small>
                    <div className="form-group">
                        <input type="url" className="form-control" placeholder="bluejeans.com any other meeting platform url"
                            value={this.state.data.meeting_url}
                            onChange={(e) => this.formUpdated({ meeting_url: e.target.value})}
                        />
                    </div>
                </div>
                <div className="bg-light p-2">
                    <small className="mr-2">Streaming information</small>
                    <div className="form-group">
                        <CheckBox checked={this.state.data.withStreaming} onClick={(e) => this.formUpdated({ withStreaming: !this.state.data.withStreaming})}
                            label={this.state.data.withStreaming ? "The cohort will be streamed" : "The cohort will NOT be streamed"}
                        ></CheckBox>
                        {
                            this.state.data.withStreaming &&
                                <select className="form-control"
                                    value={this.state.data.streaming_slug}
                                    onChange={(e) => this.formUpdated({ streaming_slug: e.target.value})}>
                                    <option value={''}>Select the cohort name or leave it blank for no streaming</option>
                                    {streamingCohortsHTML}
                                </select>
                        }
                    </div>
                </div>
                <div class="row my-3">
                    <div class="col">
                        <button type="button" className="btn btn-dark btn-lg w-100" onClick={() => this.props.history.goBack()}>Back</button>
                    </div>
                    <div class="col">
                        <button type="submit" className="btn btn-primary  btn-lg w-100">Save</button>
                    </div>
                </div>
            </form>
        )
    }
}
export default withRouter(Form);