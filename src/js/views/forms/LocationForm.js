import React from 'react';
import { withRouter } from 'react-router-dom';
import _BaseForm from './_BaseForm.js';
import validator from 'validator';
import store from '../../store';
import moment from 'moment';
import {cohortActions} from '../../actions/CustomActions.js';
class Form extends _BaseForm{

    constructor(){
        super();
        this.state = {
            data: this.setDefaultState(),
            dependencies: {
            },
            catalogs:{
                countries: {
                    "chile": [
                    "Santiago"
                    ],
                    "colombia": [
                    "Bogota",
                    "Medellin"
                    ],
                    "ecuador": [
                    "Quito",
                    "Guayaquil"
                    ],
                    "guatemala": [
                    "Guatemala City"
                    ],
                    "mexico": [
                    "Mexico City",
                    "Guadalajara",
                    "Monterrey"
                    ],
                    "peru": [
                    "Lima"
                    ],
                    "spain": [
                    "Madrid",
                    "Barcelona",
                    "Galicia",
                    "Valencia"
                    ],
                    "usa": [
                    "Miami",
                    "Orlando",
                    "New York"
                    ],
                    "venezuela": [
                    "Caracas",
                    "Maracaibo",
                    "Valencia"
                    ]
                }
            }
        };
    }

    setDefaultState(){
        return {
            id: null,
            slug: '',
            name: '',
            country: '',
            address: ''
        };
    }

    validate(data){
        //if(validator.isEmpty(data.slug)) return this.throwError('Empty slug');
        if(validator.isEmpty(data.name)) return this.throwError('Empty name');
        if(validator.isEmpty(data.country)) return this.throwError('Empty country');
        if(validator.isEmpty(data.language)) return this.throwError('Empty slug language');
        if(validator.isEmpty(data.address)) return this.throwError('Empty address');

        return true;
    }

    sanitizeData(data){
        if(typeof data.slug !== 'undefined' && (!data.slug || data.slug=='')){
            data.slug = data.name.replace(/\s+/g, '-').toLowerCase();
        }
        return data;
    }

    getCountries(countries){
        let result = [];
        for (let key in countries) result.push(key);
        return result;
    }

    render(){
        const countries = this.getCountries(this.state.catalogs.countries).map((p,i) => (<option key={i} value={p}>{p}</option>));
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Location Name"
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
                    <select className="form-control"
                        value={this.state.data.language}
                        onChange={(e) => this.formUpdated({ language: e.target.value})}>
                        <option value={null}>select a default language for this location</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
                <div className="form-group">
                    <select className="form-control"
                        value={this.state.data.country}
                        onChange={(e) => this.formUpdated({ country: e.target.value})}>
                        <option value={null}>Select a Country</option>
                        {countries}
                    </select>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Location Address"
                        value={this.state.data.address}
                        onChange={(e) => this.formUpdated({ address: e.target.value })}
                    />
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