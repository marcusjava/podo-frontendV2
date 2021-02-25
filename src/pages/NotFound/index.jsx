import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import './styles.css';
import { FrownOutlined, ArrowLeftOutlined } from '@ant-design/icons';

// import { Container } from './styles';

function NotFound() {
	const history = useHistory();
	return (
		<div className="notfound-container">
			<div className="notfound-content">
				<div className="notfound-img">
					<FrownOutlined style={{ fontSize: 300 }} />
				</div>
				<h4 style={{ fontSize: 50 }}>Pagina não encontrada</h4>
				<Button type="link" onClick={() => history.goBack()} icon={<ArrowLeftOutlined />}>
					Voltar
				</Button>
			</div>
		</div>
	);
}

export default NotFound;
