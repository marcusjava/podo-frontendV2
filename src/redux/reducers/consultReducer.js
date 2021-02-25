import {
	SET_CONSULT,
	FETCH_CONSULT_REQUEST,
	FETCH_CONSULT_SUCCESS,
	UPDATE_CONSULT_SUCCESS,
	FETCH_CONSULT_ERROR,
	CLEAR_CONSULT_STATE,
	FETCH_CONSULTS_REQUEST,
	FETCH_CONSULTS_SUCCESS,
	FETCH_CONSULTS_ERROR,
	RESET_CONSULTS,
} from '../types';

const initialState = {
	consults: {
		loading: false,
		success: false,
		error: {},
		options: [],
		items: [],
	},
	consult: {
		loading: false,
		success: false,
		error: {},
		item: {},
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_CONSULT_STATE:
			return {
				...state,
				consult: {
					loading: false,
					success: false,
					error: {},
					item: {},
				},
			};
		case FETCH_CONSULT_REQUEST:
			return {
				...state,
				consult: {
					...state.consult,
					loading: true,
					success: false,
				},
			};
		case FETCH_CONSULT_SUCCESS:
			return {
				...state,
				consult: {
					...state.consult,
					item: action.payload,
					loading: false,
					success: true,
				},
				consults: {
					...state.consults,
					items: [action.payload, ...state.consults.items],
				},
			};
		case UPDATE_CONSULT_SUCCESS:
			const index = state.consults.items.findIndex((item) => item._id === action.payload._id);
			const newArray = [...state.consults.items];
			newArray[index] = action.payload;
			return {
				...state,
				consult: {
					...state.consult,
					item: action.payload,
					loading: false,
					success: true,
				},
				consults: {
					...state.consults,
					items: newArray,
				},
			};

		case FETCH_CONSULT_ERROR:
			return {
				...state,
				consult: {
					...state.consult,
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case SET_CONSULT:
			return {
				...state,
				consult: {
					...state.consult,
					item: action.payload,
				},
			};

		case FETCH_CONSULTS_REQUEST:
			return {
				...state,
				consults: {
					...state.consults,
					loading: true,
					success: false,
				},
			};
		case FETCH_CONSULTS_SUCCESS:
			return {
				...state,
				consults: {
					...state.consults,
					items: action.payload,
					loading: false,
					success: true,
				},
			};

		case FETCH_CONSULTS_ERROR:
			return {
				...state,
				consults: {
					...state.consults,
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case RESET_CONSULTS:
			return {
				...state,
				consults: {
					error: {},
					loading: false,
					success: false,
				},
			};

		default:
			return state;
	}
};
