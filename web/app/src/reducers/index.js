import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux'

// TODO: do we need routeReducer?
export default combineReducers({
  routing: routeReducer
});
