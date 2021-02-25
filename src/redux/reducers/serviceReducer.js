import {
	CLEAR_SERVICE_STATE,
	FETCH_SERVICE_REQUEST,
	FETCH_SERVICE_SUCCESS,
	UPDATE_SERVICE_SUCCESS,
	FETCH_SERVICE_ERROR,
	FETCH_SERVICES_REQUEST,
	FETCH_SERVICES_SUCCESS,
	FETCH_SERVICES_ERROR,
} from '../types';

const initialState = {
	services: {
		loading: false,
		success: false,
		error: {},
		items: [],
		options: [],
	},
	service: {
		loading: false,
		success: false,
		error: {},
		item: {},
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_SERVICE_STATE:
			return {
				...state,
				service: {
					loading: false,
					success: false,
					error: {},
					item: {},
				},
			};
		case FETCH_SERVICE_REQUEST:
			return {
				...state,
				service: {
					...state.service,
					loading: true,
					success: false,
				},
			};
		case FETCH_SERVICE_SUCCESS:
			return {
				...state,
				service: {
					...state.service,
					item: action.payload,
					loading: false,
					success: true,
				},
				services: {
					...state.services,
					items: [action.payload, ...state.services.items],
				},
			};
		case UPDATE_SERVICE_SUCCESS:
			const index = state.services.items.findIndex((item) => item._id === action.payload._id);
			const newArray = [...state.services.items];
			newArray[index] = action.payload;
			return {
				...state,
				service: {
					...state.service,
					loading: false,
					success: true,
				},
				services: {
					...state.services,
					items: newArray,
				},
			};
		case FETCH_SERVICE_ERROR:
			return {
				...state,
				service: {
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case FETCH_SERVICES_REQUEST:
			return {
				...state,
				services: {
					loading: true,
					success: false,
				},
			};
		case FETCH_SERVICES_SUCCESS:
			return {
				...state,
				services: {
					items: action.payload,
					//options: action.payload.map(option => ({ label: option.description, value: option._id })),
					loading: false,
					success: true,
				},
			};

		case FETCH_SERVICES_ERROR:
			return {
				...state,
				services: {
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		default:
			return state;
	}
};
