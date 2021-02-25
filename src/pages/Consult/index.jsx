import React from 'react';
import { Row, Col, Button } from 'antd';
import Table from '../../components/consult/Table';
import { Link } from 'react-router-dom';
import { FcManager } from 'react-icons/fc';
import Calendar from '../../components/Calendar';

function Consult() {
	return (
		<div className="consult">
			<Row justify="center" align="middle"></Row>
			<Row>
				<Col span={24}>
					<Link to="/home/consultas/adicionar">
						<Button type="primary" icon={<FcManager size={18} />}>
							Novo
						</Button>
					</Link>
				</Col>
			</Row>
			<Row justify="center" style={{ marginTop: '30px' }}>
				<Col span={24}>
					<Calendar />
				</Col>
			</Row>
		</div>
	);
}

export default Consult;
