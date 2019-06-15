import React from 'react';
import store from '../../store';

export default class _BaseForm extends React.Component{

    constructor(){
        super();
        this._errors = [];
        this._dependencyListeners = [];
        this._dependencyTransformers = [];
        this.state = {
            _hasUserErrors: false,
            catalogs: null,
            mode: null
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
            if(this._errors.length === 0) this.props.onSave(this.sanitizeData(this.state.data));
            else{
                this.props.onError(this._errors);
            }
        }
    }
    onSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        this._errors = [];
        this.setState({ _hasUserErrors: false });
        if(!this.validate || typeof this.validate === 'undefined') throw new Error('there is no way of validating the form');
        else if(this.validate(this.state.data)) this.submit();

        return false;
    }
    sanitizeData(data){
        return data;
    }
    entityListUpdated(newEntities){}
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.data !== nextProps.data && nextProps.data) {
            return {
                data: nextProps.data
            };
        }

        // Return null to indicate no change to state.
        return null;
    }
    componentDidMount(){
        for(let entity in this.state.dependencies){
            this._dependencyTransformers[entity] = (state) => {
                let updatedDependency = {};
                updatedDependency[entity] = state;
                this.setState({
                    dependencies: Object.assign(this.state.dependencies, updatedDependency)
                });
            };
            this._dependencyListeners.push(store.subscribe('manage_'+entity, this._dependencyTransformers[entity].bind(this)));
        }
        this.catalogSubscription = store.subscribe('catalog', this.updateUpdateCatalogs.bind(this));

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

    updateUpdateCatalogs(state){
        this.setState({
            catalogs: Object.assign(this.state.catalogs, state)
        });
    }

    componentWillUnmount(){
        this._dependencyListeners.forEach(listener => listener.unsubscribe());
        this._dependencyListeners = [];
        this.catalogSubscription.unsubscribe();
    }
    formUpdated(newFormData){
        let data = Object.assign(this.state.data, newFormData);
        this.setState({ data });
    }
    _removeNulls(data){
        for(let key in data) if(!data[key]) data[key] = '';
        return data;
    }

    slugify(text)
    {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }
}