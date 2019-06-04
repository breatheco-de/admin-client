//import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';
//include your index.scss file into the bundle
import '../styles/index.scss';

var packg = require('../../package.json');
console.info("BreatheCode Platform",packg.version, process.env.ENVIRONMENT);

//import your own components
import Layout from './Layout';

//google tag manager
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
    gtmId: 'GTM-574Z6C5',
    auth: 'HXY0OFiOxShdVVBJHK5sbg',
    preview: 'env-2'
}

TagManager.initialize(tagManagerArgs);

ReactDOM.render(
  <Layout />,
  document.getElementById('app')
);