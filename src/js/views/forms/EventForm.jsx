import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import AdminStore from '../../stores/AdminStore';
import { Modal, Notify } from '../../utils/bc-components/src/index';
import * as StudentActions from '../../actions/StudentActions';
import _BaseForm from './_BaseForm';
import validator from 'validator';
import DateTime from 'react-datetime';
import ReactQuill from 'react-quill'; // ES6

const eventTypes = ['workshop','coding_weekend','hackathon','intro_to_coding','4geeks_night','other'];

class Form extends _BaseForm{
    
    constructor(){
        super();
        this.state = {
            data: this.setDefaultState(),
            addCohort: null,
            newCohort: null,
            dependencies: {
                location: AdminStore.getAll('location'),
            }
        };
    }
    setDefaultState(){
        return {
            title: '',
            url: '',
            id: null,
            capacity: 0,
            logo_url: '',
            event_date: '',
            type: '',
            address: '',
            location_slug: '',
            lang: '',
            city_slug: '',
            banner_url: '',
            invite_only: 0,
            description: ''
        };
    }
    
    sanitizeData(data){
        data.event_date = data.event_date.format("YYYY-MM-DD hh:mm:ss");
        return data;
    }
    
    validate(){
        const d = this.state.data;
        if(validator.isEmpty(d.title)) return this.throwError('Missing title');
        if(validator.isEmpty(d.description)) return this.throwError('Missing description');
        
        return true;
    }
    
    render(){
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <EditForm 
                    data={this.state.data} 
                    dependencies={this.state.dependencies} 
                    formUpdated={this.formUpdated.bind(this)} />
                <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        );
    }
}

const EditForm = ({data, dependencies, formUpdated}) => {
    const types = eventTypes.map((t,i) => (<option key={i} value={t}>{t}</option>));
    const locations = dependencies.location.map((c,i) => (<option key={i} value={c.slug}>{c.name}</option>));
    return (
        <div>
            <div className="form-group">
                <input type="text" className="form-control"  placeholder="Title"
                    value={data.title} 
                    onChange={(e) => formUpdated({ title: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control"  placeholder="Address"
                    value={data.address} 
                    onChange={(e) => formUpdated({ address: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="text" className="form-control"  placeholder="Banner URL"
                    value={data.banner_url} 
                    onChange={(e) => formUpdated({ banner_url: e.target.value})}
                />
                <small className="form-text text-muted">To be shown on the listings and internal landing</small>
            </div>
            <div className="form-group">
                <input type="number" className="form-control" placeholder="Capacity"
                    value={data.capacity} 
                    onChange={(e) => formUpdated({ capacity: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="url" className="form-control" placeholder="Event landing url"
                    value={data.url} 
                    onChange={(e) => formUpdated({ url: e.target.value})}
                />
                <small className="form-text text-muted">Where people can signup to the event (eventbrite.com, meetup.com, etc.)</small>
            </div>
            <div className="form-group">
                <DateTime value={data.event_date} 
                    onChange={(value) => formUpdated({ event_date: value})}
                />
            </div>
            <div className="form-group">
                <select className="form-control"
                     value={data.type}
                    onChange={(e) => formUpdated({ type: e.target.value})}
                >
                    <option value={null}>Select an event type</option>
                    {types}
                </select>
            </div>
            <div className="form-group">
                <select className="form-control"
                     value={data.location_slug}
                    onChange={(e) => formUpdated({ location_slug: e.target.value})}
                >
                    <option value={null}>Select a location</option>
                    {locations}
                </select>
                <small className="form-text text-muted">Initial cohort for the student</small>
            </div>
            <div className="form-group">
                <select className="form-control"
                    value={data.lang}
                    onChange={(e) => formUpdated({ lang: e.target.value})}
                >
                    <option value={null}>Select a language</option>
                    <option value={'en'}>English</option>
                    <option value={'es'}>Spanish</option>
                </select>
            </div>
            <div className="form-group">
                <select className="form-control"
                    value={data.invite_only}
                    onChange={(e) => formUpdated({ invite_only: e.target.value})}
                >
                    <option value={null}>Select visibility</option>
                    <option value={true}>Private</option>
                    <option value={false}>Invite Only</option>
                </select>
                <small className="form-text text-muted">Private events are for academy students only</small>
            </div>
            <div className="form-group">
                <select className="form-control"
                    value={data.city_slug}
                    onChange={(e) => formUpdated({ city_slug: e.target.value})}
                >
                    <option value={null}>Select a city</option>
                    <option value={'miami'}>Miami</option>
                    <option value={'caracas'}>Venezuela</option>
                    <option value={'maracaibo'}>Maracaibo</option>
                </select>
            </div>
            <div className="form-group">
                <label>Event Description:</label>
                <ReactQuill
                    value={data.description}
                    onChange={(value) => formUpdated({ description: value})}
                />
            </div>
        </div>
    );
};

export default withRouter(Form);