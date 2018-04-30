import React from 'react';
import { withRouter } from 'react-router-dom';
class UserForm extends React.Component{
    
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
                    full_name: ''
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
        this.props.onSave(this.state.data);
        e.preventDefault();
        return false;
    }
    
    render(){
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                    <input type="email" className="form-control"  aria-describedby="emailHelp" placeholder="Email"
                        value={this.state.data.username} 
                        readOnly="readonly"
                    />
                    <small id="emailHelp" className="form-text text-muted">The email cannot be changed</small>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Full Name"
                        value={this.state.data.full_name} />
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        )
    }
}
export default withRouter(UserForm);