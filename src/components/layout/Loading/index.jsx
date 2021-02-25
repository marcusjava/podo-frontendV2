import React from 'react';
import './styles.css';
const Loading = ({ show = false }) => {
	return show === true && <div id="cover-spin"></div>;
};

export default Loading;
