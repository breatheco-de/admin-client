import Flux from '@4geeksacademy/react-flux-dash';
import React from "react";
import {Panel, Loading} from '../utils/react-components/src/index';
import {Session} from 'bc-react-session';
export default class IFrameView extends Flux.View {
  
  constructor(){
    super();
    this.state = {
      loading: true
    };
  }
  
  getIframeURL(){
      const { access_token, assets_token } = Session.getPayload();
      const token = `?bc_token=${access_token}&assets_token=${assets_token}`;
      let type = this.props.match.params.entity_slug;
      let view = this.props.match.params.view_slug;
      
      //let view = this.props.match.params.view_slug;
      return process.env.ASSETS_URL+'/apps/view/'+type+'/'+view+window.location.search+token;
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