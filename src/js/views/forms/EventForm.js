import React from 'react';
import { withRouter } from 'react-router-dom';
import store from '../../store';
import _BaseForm from './_BaseForm.js';
import validator from 'validator';
import DateTime from 'react-datetime';
import ReactQuill from 'react-quill'; // ES6

export const eventTypes = ['workshop','coding_weekend','hackathon','intro_to_coding','4geeks_night','other'];
const recurrencyTypes = ['every_week', 'one_time'];

class Form extends _BaseForm{

    constructor(){
        super();
        this.state = {
            data: this.setDefaultState(),
            addCohort: null,
            newCohort: null,
            dependencies: {
                location: store.getAll('location'),
            }
        };
    }
    setDefaultState(){
        return {
            title: '',
            url: '',
            id: null,
            capacity: 100,
            logo_url: '',
            event_date: '',
            type: '',
            address: '',
            longitude: '',
            latitude: '',
            location_slug: '',
            lang: '',
            city_slug: '',
            banner_url: '',
            invite_only: 0,
            description: '',
            recurrent: 0,
            recurrent_type: ''
        };
    }

    sanitizeData(data){
        if(data.event_date && typeof data.event_date !== 'string')
            data.event_date = data.event_date.format("YYYY-MM-DD hh:mm:ss");

        if(data.recurrent_type == 'one_time') data.recurrent = false;
        else data.recurrent = true;

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
                <small className="form-text text-muted">Event Status:</small>
                <select className="form-control"
                     value={data.status}
                    onChange={(e) => formUpdated({ status: e.target.value})}
                >
                    <option value={'draft'}>Draft</option>
                    <option value={'pending_review'}>Pending Review (spelling and small details)</option>
                    <option value={'unlisted'}>Unlisted (will not be show on the calendar)</option>
                    <option value={'published'}>Published (shown on the calendar)</option>
                </select>
            </div>
            <div className="form-group">
                <input type="text" className="form-control"  placeholder="Event Address"
                    value={data.address}
                    onChange={(e) => formUpdated({ address: e.target.value})}
                />
            </div>
            <div className="form-group">
                <small className="form-text text-muted">Image Banner URL:</small>
                <input type="text" className="form-control"  placeholder="Banner URL"
                    value={data.banner_url}
                    onChange={(e) => formUpdated({ banner_url: e.target.value})}
                />
            </div>
            <div className="form-group">
                <small className="form-text text-muted">Event Capacity:</small>
                <input type="number" className="form-control" placeholder="Capacity"
                    value={data.capacity}
                    onChange={(e) => formUpdated({ capacity: e.target.value})}
                />
            </div>
            <div className="form-group">
                <input type="url" className="form-control" placeholder="Eventbrite url (or alternatives)"
                    value={data.url}
                    onChange={(e) => formUpdated({ url: e.target.value})}
                />
            </div>
            <div className="form-group">
                <small className="form-text text-muted">Date and starting time:</small>
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
                     value={data.recurrent_type}
                    onChange={(e) => formUpdated({ recurrent_type: e.target.value})}
                >
                    <option value={null}>Event frequency</option>
                    {recurrencyTypes.map((t,i) => (<option key={i} value={t}>{t}</option>))}
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
                    <option value={true}>Private (for students or invite only)</option>
                    <option value={false}>Public</option>
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
                    <option value={'maracaibo'}>Maracaibo</option>
                    <option value={'santiago'}>Santiago de Chile</option>
                    <option value={'bogota'}>Bogota</option>
                    <option value={'jacksonville'}>Jacksonville</option>
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