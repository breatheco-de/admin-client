import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm';
import validator from 'validator';

class Form extends _BaseForm{
    
    constructor(){
        super();
        this.state = {
            data: this.setDefaultState(),
            profiles: [
                { label: 'Full Stack', slug: 'full-stack' },
                { label: 'Web Development', slug: 'web-development' }
            ]
        };
    }
    
    setDefaultState(){
        return {
            slug: '',
            profile_slug: '',
            slack_url: 'https://4geeksacademy.slack.com',
            kickoff_date: ''
        };
    }
    
    validate(data){
        if(validator.isEmpty(data.kickoff_date)) return this.throwError('Empty kickoff date');
        if(validator.isEmpty(data.slug)) return this.throwError('Empty slug date');
        if(validator.isEmpty(data.slack_url)) return this.throwError('Empty slack_url date');
        if(validator.isEmpty(data.profile_slug)) return this.throwError('Empty profile_slug date');
        
        return true;
    }
    
    render(){
        const profiles = this.state.profiles.map((p,i) => (<option key={i} value={p.slug}>{p.label}</option>));
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="slug"
                        value={this.state.data.slug} 
                        onChange={(e) => this.formUpdated({ slug: e.target.value})}
                        readOnly={(this.props.mode !== 'add')}
                    />
                    {
                        (this.props.mode !== 'add') ?
                            <small id="emailHelp" className="form-text text-muted">The slug cannot be changed</small>
                        :''
                    }
                </div>
                <div className="form-group">
                    <input type="url" className="form-control" placeholder="slack url"
                        value={this.state.data.slack_url} 
                        onChange={(e) => this.formUpdated({ slack_url: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <input type="date" className="form-control" placeholder="kickoff_date"
                        value={this.state.data.kickoff_date} 
                        onChange={(e) => this.formUpdated({ kickoff_date: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <select className="form-control"
                        defaultValue={this.state.data.profile_slug}
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