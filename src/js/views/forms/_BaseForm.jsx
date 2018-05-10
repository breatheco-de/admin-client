import React from 'react';
import { UserError } from '../../utils/bc-components/index';

export default class _BaseForm extends React.Component{
    
    constructor(){
        super();
        this._errors = [];
        this.state = {
            _hasUserErrors: false
        };
        
        if(typeof this.setDefaultState !== 'function') 
            throw new Error('You need to specify the setDefaultState function');
    }
    throwError(msg){
        this._errors.push(msg);
        this.setState({ _hasUserErrors: true });
        if(!this.props.onError || typeof this.props.onError === 'undefined')
            throw new Error('there is no prop onError');
        else{
            if(this._errors.length > 0) this.props.onError(msg);
        } 
        return false;
    }
    submit(){
        if(!this.props.onSave || typeof this.props.onSave === 'undefined')
            throw new Error('there is no prop onSave');
        else{
            if(this._errors.length === 0) this.props.onSave(this.state.data);
            else{
                this._errors = [];
                this.props.onError(this._errors);
            } 
        } 
    }
    onSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        if(!this.validate || typeof this.validate === 'undefined') throw new Error('there is way of validating the form');
        else if(this.validate(this.state.data)) this.props.onSave(this.state.data);

        return false;
    }
    componentWillMount(){
        if(this.props.mode=='add'){
            this.setState({
                data: this.setDefaultState(),
                mode: this.props.mode
            });
        }
        else{
            this.setState({
                data: this._removeNulls(this.props.data),
                mode: this.props.mode
            });
        }
    }
    formUpdated(newFormData){
        let data = Object.assign(this.state.data, newFormData);
        this.setState({ data });
    }
    _removeNulls(data){
        for(let key in data) if(!data[key]) data[key] = '';
        return data;
    }
}