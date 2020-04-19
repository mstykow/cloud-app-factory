import { CssBaseline } from '@material-ui/core';
import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import awsconfig from './aws-exports';
import './index.css';

Amplify.configure(awsconfig);

ReactDOM.render(
  <>
    <CssBaseline />
    <App />
  </>,
  document.getElementById('root')
);
