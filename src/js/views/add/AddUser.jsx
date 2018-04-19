import React from "react";
import Flux from '@4geeksacademy/react-flux-dash';
import { Panel } from '../utils/bc-components/index';

export default class Add extends Flux.View {
  
  render() {
    return (
        <div className="with-padding">
            <Panel style={{padding: "10px"}} zDepth={1}>
                <h1>Add</h1>
                <form>
                    <div class="row">
                        <div class="col">
                            <input type="text" class="form-control" placeholder="First name" />
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" placeholder="Last name" />
                        </div>
                    </div>
                </form>
            </Panel>
        </div>
    );
  }
}