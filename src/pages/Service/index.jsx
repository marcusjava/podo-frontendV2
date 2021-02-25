import React from 'react';
import { Row, Col } from 'antd';
import Table from '../../components/service/Table';
import Modal from '../../components/service/Modal';

const Service = () => {
	return (
		<div className="users">
			<Row justify="center" align="middle"></Row>
			<Row justify="end">
				<Col span={24}>
					<Modal />
				</Col>
			</Row>
			<Row justify="center" style={{ marginTop: '30px' }}>
				<Col span={24}>
					<Table />
				</Col>
			</Row>
		</div>
	);
};

export default Service;
