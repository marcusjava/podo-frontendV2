import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Spin, Row, Col, message, DatePicker, Transfer } from 'antd';
import { FcManager } from 'react-icons/fc';
import { MdEdit } from 'react-icons/md';
import { saveConsult, updateConsult } from '../../redux/actions/consultActions';
import { getClients } from '../../redux/actions/clientActions';
import { getProcedures } from '../../redux/actions/procedureActions';
import { useSelector, useDispatch } from 'react-redux';

const { Option } = Select;

const { TextArea } = Input;

const ConsultModal = ({ editMode = false, data }) => {
	const [visible, setVisible] = useState(false);

	const [selectedKeys, setSelectedKeys] = useState([]);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const { procedures } = useSelector((state) => state.procedure);

	const { clients } = useSelector((state) => state.client);

	const { item, success, error } = useSelector((state) => state.consult.consult);

	useEffect(() => {
		dispatch(getProcedures());
		dispatch(getClients());
	}, [dispatch]);

	useEffect(() => {
		if (editMode && visible) {
			form.setFieldsValue({
				_id: data.key,
				service: data.service._id,
				name: data.name,
				description: data.description,
			});
		}
	}, [editMode, visible]);

	useEffect(() => {
		if (success && visible) {
			message.success('Consulta salva com sucesso');
			form.resetFields();
			setVisible(false);
		}

		if (Object.keys(error).length > 0 && visible) {
			form.setFields([{ name: error.path, errors: [error.message] }]);
			message.error('Ocorreu um erro ao salvar a consulta');
		}
	}, [error, success]);

	const handleSubmit = async (data) => {
		console.log(data);
		editMode ? dispatch(updateConsult(data, data._id)) : dispatch(saveConsult(data));
	};

	const onClose = (e) => {
		form.resetFields();
	};

	const onCancel = (e) => {
		form.resetFields();
		setVisible(false);
	};

	const filterOption = (inputValue, option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

	const handleChange = (targetKeys) => {
		setSelectedKeys(targetKeys);
	};

	const buttonType = editMode ? (
		<MdEdit size={18} onClick={() => setVisible(true)} style={{ cursor: 'pointer' }} />
	) : (
		<Button
			type="primary"
			icon={<FcManager size={18} />}
			onClick={() => setVisible(true)}
			style={{ fontSize: '16px' }}
		>
			Novo
		</Button>
	);

	return (
		<div>
			{buttonType}
			<Modal
				title="Criar consulta"
				visible={visible}
				centered
				destroyOnClose
				footer={null}
				onCancel={() => setVisible(false)}
				afterClose={onClose}
				forceRender
				style={{ top: 20 }}
				width={900}
			>
				<Form name="new-procedure" form={form} onFinish={handleSubmit}>
					<Form.Item name="_id">
						<Input type="hidden" />
					</Form.Item>
					<Form.Item
						rules={[
							{
								required: true,
								message: 'Informe a Data da consulta',
							},
						]}
						name="date"
						label="Data/Hora"
					>
						<DatePicker format="DD/MM/YYYY HH:mm" showTime />
					</Form.Item>
					<Form.Item
						name="client"
						label="Cliente"
						rules={[
							{
								required: true,
								message: 'Informe o cliente',
							},
						]}
					>
						<Select
							showSearch
							notFoundContent={clients.items.length === 0 ? <Spin size="small" /> : null}
							style={{ width: 400 }}
						>
							{clients.items.map((item) => (
								<Option key={item._id} value={item._id}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="procedures"
						label="Procedimentos"
						rules={[
							{
								required: true,
								message: 'Informe ao menos um procedimento',
							},
						]}
					>
						<Transfer
							rowKey={(record) => record._id}
							listStyle={{
								width: 350,
								height: 450,
							}}
							dataSource={procedures.items}
							targetKeys={selectedKeys}
							showSearch
							filterOption={filterOption}
							render={(item) => item.name}
							onChange={handleChange}
						/>
					</Form.Item>
					<Form.Item
						name="type_consult"
						label="Tipo consulta"
						rules={[
							{
								required: true,
								message: 'Informe o tipo de consulta',
							},
						]}
					>
						<Select placeholder="Selecione" style={{ width: 200 }}>
							<Option key="Agendada">Agendada</Option>
							<Option key="Retorno">Retorno</Option>
							<Option key="Urgência">Urgência</Option>
						</Select>
					</Form.Item>
					<Form.Item name="observations" label="Observações">
						<TextArea rows={4} />
					</Form.Item>

					<Form.Item
						name="status"
						label="Status"
						rules={[
							{
								required: true,
								message: 'Informe o status',
							},
						]}
					>
						<Select defaultValue="Marcada" placeholder="Selecione" style={{ width: 200 }}>
							<Option key="Marcada">Marcada</Option>
							<Option key="Realizada">Realizada</Option>
							<Option key="Cancelada">Cancelada</Option>
							<Option key="Remarcada">Remarcada</Option>
						</Select>
					</Form.Item>

					<Button type="primary" htmlType="submit">
						{editMode ? 'Atualizar' : 'Salvar'}
					</Button>
					<Button type="danger" htmlType="button" onClick={onCancel}>
						Limpar
					</Button>
				</Form>
			</Modal>
		</div>
	);
};

export default ConsultModal;
