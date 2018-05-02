import React from 'react';
import { withRouter } from 'react-router-dom';
class Form extends React.Component{
    
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
        this.props.onSave(this.state.data);
        return false;
    }
    
    render(){
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                    <input type="email" className="form-control"  aria-describedby="emailHelp" placeholder="Email"
                        value={this.state.data.username} 
                        onChange={(e) => this.formUpdated({ username: e.target.value})}
                        readOnly={(this.props.mode !== 'add')}
                    />
                    {
                        (this.props.mode !== 'add') ?
                            <small id="emailHelp" className="form-text text-muted">The email cannot be changed</small>
                        :''
                    }
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Full Name"
                        value={this.state.data.full_name} 
                        onChange={(e) => this.formUpdated({ full_name: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <select className="form-control"
                        onChange={(e) => this.formUpdated({ type: e.target.value})}>
                        <option value={null}>select a cohort</option>
                    </select>
                </div>
                <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        )
    }
}
export default withRouter(Form);