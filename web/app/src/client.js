'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history'
import configureStore from './stores/store';
import Root from './containers/Root'
import getRoutes from './routes';
import config from 'config';

const historyConfig = { basename: config.basePath }
const history = useRouterHistory(createHistory)(historyConfig);
const store = configureStore(history);
const routes = getRoutes(store);

ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('app')
)
