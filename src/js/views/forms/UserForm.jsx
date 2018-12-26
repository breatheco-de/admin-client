import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm';
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
            full_name: '',
            type: ''
        };
    }
    
    validate(){
        const d = this.state.data;
        if(validator.isEmpty(d.full_name)) return this.throwError('Missing the Full Name');
        if(!validator.isEmail(d.username)) return this.throwError('Missing the Full Name');
        if(validator.isEmpty(d.type) || d.type=='select') return this.throwError('Missing the type of user');
        
        return true;
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
                    <div className="form-group">
                        <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Full Name"
                            value={this.state.data.full_name} 
                            onChange={(e) => this.formUpdated({ full_name: e.target.value})}
                        />
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