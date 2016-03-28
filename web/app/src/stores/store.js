import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistory } from 'react-router-redux'
import reducer from '../reducers';
import thunk from 'redux-thunk';

export default function configureStore (history, initialState) {
  const reduxRouterMiddleware = syncHistory(history);
  const middlewares = [thunk, reduxRouterMiddleware];

  let middleware = applyMiddleware(...middlewares);
  if (__DEVELOPMENT__) {
    const logger = require('redux-logger')();
    const devTools = require('../containers/DevTools').default.instrument()
    middleware = compose(applyMiddleware(...middlewares, logger), devTools)
  }

  const store = middleware(createStore)(reducer, initialState);

  // required for replaying actions from devtools to work
  if (__DEVTOOLS__) {
    reduxRouterMiddleware.listenForReplays(store, ({ routing }) => routing.location);
  }
  
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
