import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { State, reducer, initialState } from './state';

const enhancers = composeWithDevTools(applyMiddleware(thunk));

let store: Store<State> | null = null;
export function getStore() {
  if (store === null) {
    store = createStore(reducer, initialState, enhancers);
  }

  return store;
}
