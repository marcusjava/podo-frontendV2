import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		Authorization: localStorage.getItem('token'),
	},
});
export default api;
