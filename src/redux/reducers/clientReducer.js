import {
	FETCH_CLIENT_REQUEST,
	FETCH_CLIENT_SUCCESS,
	UPDATE_CLIENT_SUCCESS,
	CLEAR_CLIENT_STATE,
	FETCH_CLIENT_ERROR,
	FETCH_CLIENTS_REQUEST,
	FETCH_CLIENTS_SUCCESS,
	FETCH_CLIENTS_ERROR,
} from '../types';

const initialState = {
	clients: {
		loading: false,
		success: false,
		error: {},
		items: [],
		options: [],
	},
	client: {
		loading: true,
		success: false,
		error: {},
		item: {},
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_CLIENT_STATE:
			return {
				...state,
				client: {
					loading: false,
					success: false,
					error: {},
					item: {},
				},
			};
		case FETCH_CLIENT_REQUEST:
			return {
				...state,
				client: {
					...state.client,
					loading: true,
					success: false,
				},
			};
		case FETCH_CLIENT_SUCCESS:
			return {
				...state,
				client: {
					...state.client,
					item: action.payload,
					loading: false,
					success: true,
				},
				clients: {
					...state.clients,
					items: [action.payload, ...state.clients.items],
				},
			};

		case UPDATE_CLIENT_SUCCESS:
			const index = state.clients.items.findIndex((item) => item._id === action.payload._id);
			const newArray = [...state.clients.items];
			newArray[index] = action.payload;
			return {
				...state,
				clients: {
					...state.clients,
					items: newArray,
				},
			};

		case FETCH_CLIENT_ERROR:
			return {
				...state,
				client: {
					...state.client,
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case FETCH_CLIENTS_REQUEST:
			return {
				...state,
				clients: {
					...state.clients,
					loading: true,
					success: false,
				},
			};
		case FETCH_CLIENTS_SUCCESS:
			return {
				...state,
				clients: {
					...state.clients,
					items: action.payload,
					loading: false,
					success: true,
				},
			};

		case FETCH_CLIENTS_ERROR:
			return {
				...state,
				clients: {
					...state.clients,
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		default:
			return state;
	}
};
