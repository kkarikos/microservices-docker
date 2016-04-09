import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux'
import { props } from './props';

export default combineReducers({
  routing: routeReducer,
  props: props
});
