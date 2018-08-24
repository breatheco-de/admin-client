import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel } from '..//utils/react-components/src/index';

export default class HomeView extends Flux.View {
  
  render() {
    return (
        <div className="with-padding">
            <Panel style={{padding: "10px"}} zDepth={1}>
                <h1>Hello, you are inside</h1>
            </Panel>
        </div>
    );
  }
}