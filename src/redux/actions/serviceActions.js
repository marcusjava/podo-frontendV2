import {
	FETCH_SERVICE_REQUEST,
	FETCH_SERVICE_SUCCESS,
	UPDATE_SERVICE_SUCCESS,
	FETCH_SERVICE_ERROR,
	FETCH_SERVICES_REQUEST,
	FETCH_SERVICES_SUCCESS,
	FETCH_SERVICES_ERROR,
} from '../types';

import { toastr } from 'react-redux-toastr';

import axios from 'axios';

export const saveService = (data) => (dispatch) => {
	dispatch({ type: FETCH_SERVICE_REQUEST });

	return axios
		.post('/services', data)
		.then((response) => {
			dispatch({ type: FETCH_SERVICE_SUCCESS, payload: response.data });
		})
		.catch((error) => {
			dispatch({ type: FETCH_SERVICE_ERROR, payload: error.response.data });
			toastr.error(error.response.data.message);
		});
};

export const updateService = (data, id) => (dispatch) => {
	dispatch({ type: FETCH_SERVICE_REQUEST });

	return axios
		.put(`/services/${id}`, data)
		.then((response) => {
			dispatch({ type: UPDATE_SERVICE_SUCCESS, payload: response.data });
		})
		.catch((error) => {
			dispatch({ type: FETCH_SERVICE_ERROR, payload: error.response.data });
		});
};

export const getServices = () => (dispatch) => {
	dispatch({ type: FETCH_SERVICES_REQUEST });

	return axios
		.get('/services')
		.then((response) => {
			dispatch({ type: FETCH_SERVICES_SUCCESS, payload: response.data });
		})
		.catch((error) => {
			dispatch({ type: FETCH_SERVICES_ERROR, payload: error.response.data });
		});
};

export const Search = (input) => (dispatch) => {
	dispatch({ type: FETCH_SERVICES_REQUEST });

	return axios
		.get(`/services/search/?search=${input}`)
		.then((response) => {
			dispatch({ type: FETCH_SERVICES_SUCCESS, payload: response.data });
		})
		.catch((error) => {
			dispatch({ type: FETCH_SERVICES_ERROR, payload: error.response.data });
		});
};
