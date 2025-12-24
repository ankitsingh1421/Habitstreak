import * as React from 'react';
import { render } from 'react-dom';
import { App } from 'app';
import { AppProviders } from 'context';
import reportWebVitals from './reportWebVitals';

render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root')
);

reportWebVitals();
