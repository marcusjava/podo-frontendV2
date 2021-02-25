import {
  SET_CONSULT,
  UPDATE_CONSULT_SUCCESS,
  FETCH_CONSULT_REQUEST,
  FETCH_CONSULT_SUCCESS,
  FETCH_CONSULT_ERROR,
  FETCH_CONSULTS_REQUEST,
  FETCH_CONSULTS_SUCCESS,
  FETCH_CONSULTS_ERROR,
} from "../types";

import axios from "axios";

export const saveConsult = (data) => (dispatch) => {
  dispatch({ type: FETCH_CONSULT_REQUEST });
  return axios
    .post("/consults", data)
    .then((response) => {
      dispatch({ type: FETCH_CONSULT_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: FETCH_CONSULT_ERROR, payload: error.response.data });
    });
};

export const setConsult = (data) => (dispatch) => {
  dispatch({ type: SET_CONSULT, payload: data });
};

export const updateConsult = (data) => (dispatch) => {
  dispatch({ type: FETCH_CONSULT_REQUEST });

  return axios
    .put(`/consults/${data._id}`, data)
    .then((response) => {
      dispatch({ type: UPDATE_CONSULT_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: FETCH_CONSULT_ERROR, payload: error.response.data });
    });
};

export const getConsults = (query) => (dispatch) => {
  dispatch({ type: FETCH_CONSULTS_REQUEST });

  return axios
    .get(`/consults`, { params: query })
    .then((response) => {
      dispatch({ type: FETCH_CONSULTS_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: FETCH_CONSULTS_ERROR, payload: error.response.data });
    });
};

export const getConsult = (id) => (dispatch) => {
  dispatch({ type: FETCH_CONSULT_REQUEST });
  return axios
    .get(`/consults/${id}`)
    .then((response) => {
      dispatch({ type: FETCH_CONSULT_SUCCESS, payload: response.data });
    })
    .catch((error) =>
      dispatch({ type: FETCH_CONSULT_ERROR, payload: error.response.data })
    );
};

export const searchConsults = (input) => (dispatch) => {
  dispatch({ type: FETCH_CONSULTS_REQUEST });
  return axios
    .get(`/consults/search/?search=${input}`)
    .then((response) => {
      dispatch({ type: FETCH_CONSULTS_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: FETCH_CONSULTS_ERROR, payload: error.response.data });
    });
};
