import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm';
import validator from 'validator';

class UserForm extends _BaseForm{
    
    constructor(){
        super();
        this.state = {
            data: null
        };
    }
    
    componentWillMount(){
        if(this.props.mode=='add'){
            this.setState({
                data: {
                    username: '',
                    full_name: '',
                    type: ''
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
        let data = Object.assign(this.state.data, newFormData);
        this.setState({ data });
    }
    
    onSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.validate(this.state.data)) this.props.onSave(this.state.data);
        return false;
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
                        <label>User Role</label>
                        <select className="form-control"
                            onChange={(e) => this.formUpdated({ type: e.target.value})}>
                            <option value="select">Select the type of user</option>
                            <option value="admin">admin</option>
                            <option value="admin">admissions</option>
                            <option value="career_support">carreer support</option>
                        </select>
                    </div>
                    <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}
export default withRouter(UserForm);