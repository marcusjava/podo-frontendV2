import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import multi from 'redux-multi';
import promise from 'redux-promise';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger'

const middleware = [thunk, multi, promise];

if (process.env.NODE_ENV !== 'production') {
	middleware.push(createLogger())
  }

const initialState = {};

const store = createStore(
	rootReducer,
	initialState,
	compose(
		applyMiddleware(...middleware),
		(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) || compose
	)
);

export default store;
