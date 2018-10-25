import Flux from '@4geeksacademy/react-flux-dash';
import React from "react";
import {Panel, Loading} from '../utils/react-components/src/index';
import {Session} from 'bc-react-session';
export default class IFrameManageView extends Flux.View {
  
  constructor(){
    super();
    this.state = {
      loading: true
    };
  }
  
  getIframeURL(){
      const session = Session.store.getSession();
      const token = `?bc_token=${session.user.access_token}&assets_token=${session.user.assets_token}`;
      let type = this.props.match.params.entity_slug;
      if(type==="replit") return process.env.ASSETS_URL+'/apps/replit-maker'+token;
      else if(type==="quiz") return process.env.ASSETS_URL+'/apps/quiz-maker'+token;
      else if(type==="syllabus") return process.env.ASSETS_URL+'/apps/syllabus-maker'+token;
      else if(type==="checkin") return process.env.ASSETS_URL+'/apps/checkin'+token;
      else return process.env.ASSETS_URL+'/apps/'+type+token;
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