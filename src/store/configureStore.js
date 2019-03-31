import { createStore, combineReducers } from 'redux';
import gbxmlReducer from '../reducers/gbmxl'

export default () => {
  const store = createStore(
    combineReducers({
      gbxml: gbxmlReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
