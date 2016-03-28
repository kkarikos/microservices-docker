import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../containers/App';
import Main from '../containers/Main';

export default (store) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Main}/>
    </Route>
  );
};
