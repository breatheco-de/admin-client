import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm.js';
import validator from 'validator';
import store from '../../store';

class UserForm extends _BaseForm{

    constructor(){
        super();
        this.state = {
            data: this.setDefaultState()
        };
    }

    setDefaultState(){
        return {
            username: '',
            last_name:'',
            first_name:'',
            type: ''
        };
    }

    validate(){
        const d = this.state.data;
        if(validator.isEmpty(d.first_name)) return this.throwError('Missing the First Name');
        if(validator.isEmpty(d.last_name)) return this.throwError('Missing the Last Name');
        if(!validator.isEmail(d.username)) return this.throwError('Missing the Email');
        if(validator.isEmpty(d.type) || d.type=='select') return this.throwError('Missing the type of user');

        return true;
    }

    sanitizeData(data){
        data.full_name = data.first_name + ' ' + data.last_name;
        return data;
    }

    render(){
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        <input type="email" className="form-control"  aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.data.username}
                            onChange={(e) => this.formUpdated({ username: e.target.value})}
                            readOnly={(this.props.mode !== 'add')}
                        />
                        <small id="emailHelp" className="form-text text-muted">The email cannot be changed</small>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <input type="text" className="form-control" placeholder="First Name"
                                value={this.state.data.first_name !== '' ? this.state.data.first_name : this.state.data.full_name}
                                onChange={(e) => this.formUpdated({ first_name: e.target.value})}
                            />
                        </div>
                        <div className="col-6">
                            <input type="text" className="form-control" placeholder="Last Name"
                                value={this.state.data.last_name}
                                onChange={(e) => this.formUpdated({ last_name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <select className="form-control" value={this.state.data.type}
                            onChange={(e) => this.formUpdated({ type: e.target.value})}>
                            <option value="select">Select the type of user</option>
                            { store.getCatalog('user_types').map((l,i) => (<option key={i} value={l.value}>{l.label}</option>)) }
                        </select>
                        <small className="text-info">Restrict the user for certain priviledges</small>
                    </div>
                    <div className="form-group">
                        <select className="form-control" value={this.state.data.parent_location_id}
                            onChange={(e) => this.formUpdated({ parent_location_id: (e.target.value == 'select') ? null : e.target.value})}>
                            <option value="select">Give access to all locations</option>
                            { store.getAll('location').map((l,i) => (<option key={i} value={l.id}>access only {l.name}</option>)) }
                        </select>
                        <small className="text-info">The user will only have access to its parent location data</small>
                    </div>
                    <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}
export default withRouter(UserForm);