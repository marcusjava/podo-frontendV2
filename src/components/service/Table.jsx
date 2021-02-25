import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Row, Col } from 'antd';
import Spinner from '../layout/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '../../redux/actions/serviceActions';
import { SearchOutlined } from '@ant-design/icons';
import Modal from './Modal';

const ServiceTable = () => {
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [searchColumn, setSearchColumn] = useState('');

	const dispatch = useDispatch();

	const { items, loading } = useSelector((state) => state.service.services);

	useEffect(() => {
		dispatch(getServices());
	}, [dispatch]);

	useEffect(() => {
		if (items) {
			setData(
				items.map((service) => ({
					key: service._id,
					description: service.description,
					observations: service.observations,
				}))
			);
		}
	}, [items]);

	let searchInput = null;

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		console.log(selectedKeys[0], dataIndex);
		setSearchText(selectedKeys[0]);
		setSearchColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const getColumnSearchProps = (dataIndex, name) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						searchInput = node;
					}}
					placeholder="Buscar"
					value={selectedKeys[0]}
					onChange={(e) => {
						return setSelectedKeys(e.target.value ? [e.target.value] : []);
					}}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Buscar
				</Button>
				<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Limpar
				</Button>
			</div>
		),
		filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) => {
			return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
		},
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) setTimeout(() => searchInput.select());
		},
	});

	const columns = [
		{
			key: 'description',
			title: 'Descrição',
			dataIndex: 'description',

			render: (description) => {
				return <strong>{description}</strong>;
			},
			...getColumnSearchProps('name'),
		},
		{
			key: 'observations',
			width: '50',
			title: 'Observações',
			dataIndex: 'observations',
		},

		{
			title: 'Açoes',
			render: (record) => <Modal editMode={true} initial={record} />,
		},
	];

	return !loading ? (
		<div className="container">
			<Row>
				<Col span={12}>
					<Table dataSource={data} columns={columns} footer={(current) => `Total: ${current.length}`} />
				</Col>
			</Row>
		</div>
	) : (
		<Spinner />
	);
};

export default ServiceTable;
