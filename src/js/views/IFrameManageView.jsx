import Flux from '@4geeksacademy/react-flux-dash';
import React from "react";
import {Panel, Loading} from '../utils/bc-components/src/index';

export default class IFrameManageView extends Flux.View {
  
  constructor(){
    super();
    this.state = {
      loading: true
    };
  }
  
  getIframeURL(){
      let type = this.props.match.params.entity_slug;
      if(type==="replit") return process.env.ASSETS_URL+'/apps/replit-maker';
      if(type==="quiz") return process.env.ASSETS_URL+'/apps/quiz-maker';
      if(type==="syllabus") return process.env.ASSETS_URL+'/apps/syllabus-maker';
      return '';
  }
  
  render() {
    return (
      <Panel padding={false} style={{overflow: 'hidden'}}>
        <Loading show={this.state.loading} />
        <iframe onLoad={()=>this.setState({loading: false})} className="lesson-iframe" src={this.getIframeURL()} 
          height="100%" width="100%" frameBorder="0" />
      </Panel>
    );
  }
}