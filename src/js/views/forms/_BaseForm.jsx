import React from 'react';
import { UserError } from '../../utils/bc-components/index';

export default class _BaseForm extends React.Component{
    
    constructor(){
        super();
        this._errors = [];
        this.state = {
            _hasUserErrors: false
        }
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
}