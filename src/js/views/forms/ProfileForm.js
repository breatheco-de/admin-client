import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm.js';
import validator from 'validator';

class ProfileForm extends _BaseForm{

    constructor(){
        super();
        this.state = {
            data: this.setDefaultState()
        };
    }

    setDefaultState(){
        return {
            name: '',
            description: '',
            slug: ''
        };
    }

    validate(){
        const d = this.state.data;
        if(validator.isEmpty(d.name)) return this.throwError('Missing name');
        if(validator.isEmpty(d.description)) return this.throwError('Missing description');
        if(validator.isEmpty(d.slug)) return this.throwError('Missing the type of user');

        return true;
    }

    render(){
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="slug"
                            value={this.state.data.slug}
                            onChange={(e) => this.formUpdated({ slug: this.slugify(e.target.value)})}
                            readOnly={(this.props.mode !== 'add')}
                        />
                        <small id="emailHelp" className="form-text text-muted">The email cannot be changed</small>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Name"
                            value={this.state.data.name}
                            onChange={(e) => this.formUpdated({ name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Description"
                            value={this.state.data.description}
                            onChange={(e) => this.formUpdated({ description: e.target.value})}
                        />
                    </div>
                    <button type="button" className="btn btn-light" onClick={() => this.props.history.goBack()}>Back</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}
export default withRouter(ProfileForm);