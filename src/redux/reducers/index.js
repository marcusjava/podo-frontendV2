import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

import userReducer from './userReducer';
import clientReducer from './clientReducer';
import consultReducer from './consultReducer';
import errorReducer from './errorReducer';
import procedureReducer from './procedureReducer';
import serviceReducer from './serviceReducer';

export default combineReducers({
	toastr: toastrReducer,
	auth: userReducer,
	errors: errorReducer,
	client: clientReducer,
	consult: consultReducer,
	procedure: procedureReducer,
	service: serviceReducer,
});
