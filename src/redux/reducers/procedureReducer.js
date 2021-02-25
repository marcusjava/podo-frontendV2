import {
	CLEAR_PROCEDURE_STATE,
	FETCH_PROCEDURE_REQUEST,
	FETCH_PROCEDURE_SUCCESS,
	UPDATE_PROCEDURE_SUCCESS,
	FETCH_PROCEDURE_ERROR,
	FETCH_PROCEDURES_REQUEST,
	FETCH_PROCEDURES_SUCCESS,
	FETCH_PROCEDURES_ERROR,
} from '../types';

const initialState = {
	procedures: {
		loading: false,
		success: false,
		error: {},
		items: [],
	},
	procedure: {
		loading: false,
		success: false,
		error: {},
		item: {},
	},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_PROCEDURE_STATE:
			return {
				...state,
				procedure: {
					loading: false,
					success: false,
					error: {},
					item: {},
				},
			};
		case FETCH_PROCEDURE_REQUEST:
			return {
				...state,
				procedure: {
					...state.procedure,
					loading: true,
					success: false,
				},
			};
		case FETCH_PROCEDURE_SUCCESS:
			return {
				...state,
				procedure: {
					...state.procedure,
					item: action.payload,
					loading: false,
					success: true,
				},
				procedures: {
					...state.procedures,
					items: [action.payload, ...state.procedures.items],
				},
			};

		case UPDATE_PROCEDURE_SUCCESS:
			const index = state.procedures.items.findIndex((item) => item._id === action.payload._id);
			const newArray = [...state.procedures.items];
			newArray[index] = action.payload;
			return {
				...state,
				procedure: {
					...state.procedure,
					loading: false,
					success: true,
				},
				procedures: {
					...state.procedures,
					items: newArray,
				},
			};

		case FETCH_PROCEDURE_ERROR:
			return {
				...state,
				procedure: {
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		case FETCH_PROCEDURES_REQUEST:
			return {
				...state,
				procedures: {
					loading: true,
					success: false,
				},
			};
		case FETCH_PROCEDURES_SUCCESS:
			return {
				...state,
				procedures: {
					items: action.payload,
					loading: false,
					success: true,
				},
			};

		case FETCH_PROCEDURES_ERROR:
			return {
				...state,
				procedures: {
					error: action.payload,
					loading: false,
					success: false,
				},
			};

		default:
			return state;
	}
};
