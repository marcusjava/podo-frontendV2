import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import pt_BR from 'antd/lib/locale/pt_BR';
import 'react-circular-progressbar/dist/styles.css';
import { ConfigProvider } from 'antd';
import 'moment/locale/pt-br';
import moment from 'moment';

moment.locale('pt-br');

ReactDOM.render(
	<ConfigProvider locale={pt_BR}>
		<App />
	</ConfigProvider>,
	document.getElementById('root')
);
