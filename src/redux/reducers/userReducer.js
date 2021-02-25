import {
	SET_USER,
	FETCH_USERS_REQUEST,
	FETCH_USERS_SUCCESS,
	FETCH_USERS_ERROR,
	SET_AUTHENTICATED,
	SET_UNAUTHENTICATED,
	LOADING_USER,
	FETCH_USER_SUCCESS,
	FETCH_USER_REQUEST,
	FETCH_USER_ERROR,
} from '../types';

import isEmpty from '../../utils/isEmpty';
const initialState = {
	user: {
		loading: false,
		success: false,
		credentials: {},
		error: {},
		item: {},
		options: [],
	},
	users: {
		loading: false,
		success: false,
		error: {},
		items: [],
		options: [],
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				loading: false,
				authenticated: true,
			};
		case SET_UNAUTHENTICATED:
			return initialState;
		case SET_USER:
			return {
				...state,
				user: {
					...state.user,
					loading: false,
					success: true,
					credentials: action.payload,
					authenticated: !isEmpty(action.payload),
				},
			};
		case FETCH_USER_REQUEST:
			return {
				...state,
				user: {
					...state.user,
					loading: true,
					success: false,
				},
			};

		case FETCH_USER_SUCCESS:
			return {
				...state,
				user: {
					...state.user,
					item: action.payload,
					loading: false,
					success: true,
				},
			};

		case FETCH_USER_ERROR:
			return {
				...state,
				user: {
					...state.user,
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case FETCH_USERS_REQUEST:
			return {
				...state,
				users: {
					...state.users,
					loading: true,
					success: false,
				},
			};

		case FETCH_USERS_SUCCESS:
			return {
				...state,
				users: {
					...state.users,
					loading: false,
					success: true,
					items: action.payload,
				},
			};

		case FETCH_USERS_ERROR:
			return {
				...state,
				users: {
					...state.users,
					error: action.payload,
					loading: false,
					success: false,
				},
			};
		case LOADING_USER:
			return {
				...state,
				user: {
					...state.user,
					loading: true,
				},
			};
		default:
			return state;
	}
};
