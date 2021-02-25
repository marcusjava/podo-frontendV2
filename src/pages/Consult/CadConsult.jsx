import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  message,
  DatePicker,
  Transfer,
  Card,
  Space,
  Avatar,
  InputNumber,
  Col,
  Row,
} from "antd";
import { saveConsult, updateConsult } from "../../redux/actions/consultActions";
import { getClients } from "../../redux/actions/clientActions";
import { getProcedures } from "../../redux/actions/procedureActions";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const { TextArea } = Input;

const CadConsult = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [price, setPrice] = useState(0);
  const [anamnese, setAnamnese] = useState({});

  const history = useHistory();

  const { id } = useParams();

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { procedures } = useSelector((state) => state.procedure);

  const { clients } = useSelector((state) => state.client);

  const { success, error } = useSelector((state) => state.consult.consult);

  useEffect(() => {
    dispatch(getProcedures());
    dispatch(getClients());

    return function clean() {
      dispatch({ type: "CLEAR_CONSULT_STATE" });
    };
  }, [dispatch]);

  useEffect(() => {
    async function getConsult(id) {
      const response = await axios.get(`/consults/${id}`);
      const { data } = response;
      form.setFieldsValue({
        _id: data._id,
        date: moment(data.date),
        client: data.client._id,
        procedures: data.procedures.map((item) => item._id),
        anamnese: data.anamnese,
        price: data.procedures.reduce(
          (acc, value) => acc + parseInt(value.price),
          0
        ),
        type_consult: data.type_consult,
        status: data.status,
        observations: data.observations,
      });

      setSelectedKeys(data.procedures.map((item) => item._id));
      setAnamnese(data.anamnese || {});

      setPrice(
        data.procedures.reduce((acc, value) => acc + parseInt(value.price), 0)
      );
    }
    if (id) {
      setEditMode(true);
      getConsult(id);
    }
  }, [id]);

  useEffect(() => {
    if (success) {
      message.success("Consulta salva com sucesso");
      form.resetFields();
      setEditMode(false);
      history.goBack();
    }

    if (error) {
      form.setFields([{ name: error.path, errors: [error.message] }]);
    }
  }, [error, success]);

  const filterOption = (inputValue, option) =>
    option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  const handleChange = (targetKeys) => {
    setPrice(0);
    const keys = targetKeys;

    const { items } = procedures;

    let total = 0;

    keys.forEach((key) => {
      //pesquisar as procedures
      const procObj = items.find((item) => item._id === key);

      total += parseInt(procObj.price);
      setPrice((total) => total + parseInt(procObj.price));

      form.setFieldsValue({
        price: total,
      });
    });

    setSelectedKeys(targetKeys);
  };

  const handleSubmit = async (data) => {
    const { _id, date, client, observations, status, type_consult } = data;
    if (selectedKeys.length === 0) {
      message.error("Selecione ao menos um procedimento");
      return;
    }

    const sendData = {
      _id,
      date: moment(date).format("YYYY-MM-DD HH:mm"),
      client,
      procedures: selectedKeys,
      anamnese,
      price: data.price,
      observations,
      status,
      type_consult,
    };

    editMode
      ? dispatch(updateConsult(sendData, data._id))
      : dispatch(saveConsult(sendData));
  };

  return (
    <Col md={12}>
      <Card
        title={editMode ? "Editar Consulta" : "Cadastrar Consulta"}
        bordered={false}
      >
        <Form
          name="new-consult"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "Marcada" }}
        >
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Informe a Data da consulta",
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
                message: "Informe o cliente",
              },
            ]}
          >
            <Select
              showSearch
              notFoundContent={
                clients.items.length === 0 ? <Spin size="small" /> : null
              }
              style={{ width: "50%" }}
              size="large"
              optionFilterProp="children"
              filterOption={(input, option) => {
                return (
                  option.children.props.children[1]
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                );
              }}
            >
              {clients.items.map((item) => (
                <Option key={item._id} value={item._id}>
                  <div>
                    <span
                      role="img"
                      aria-label="Image"
                      style={{ marginRight: 5 }}
                    >
                      <Avatar src={item.avatar_url} />
                    </span>
                    {item.name}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ marginBottom: 25 }}>
            <h4>Procedimentos</h4>
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
              render={(item) => `${item.name} - R$ ${item.price}`}
              onChange={handleChange}
            />
          </div>

          <Form.Item name="price" label="Total">
            <InputNumber size="large" />
          </Form.Item>

          <Form.Item
            name="type_consult"
            label="Tipo consulta"
            rules={[
              {
                required: true,
                message: "Informe o tipo de consulta",
              },
            ]}
          >
            <Select placeholder="Selecione" style={{ width: 200 }}>
              <Option key="Agendada">Agendada</Option>
              <Option key="Retorno">Retorno</Option>
              <Option key="Urgencia">Urgência</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Informe o status",
              },
            ]}
          >
            <Select placeholder="Selecione" style={{ width: 200 }}>
              <Option key="Marcada">Marcada</Option>
              <Option key="Realizada">Realizada</Option>
              <Option key="Cancelada">Cancelada</Option>
              <Option key="Remarcada">Remarcada</Option>
            </Select>
          </Form.Item>
          <Form.Item name="observations" label="Observações">
            <TextArea
              autoSize={{ minRows: 4, maxRows: 4 }}
              showCount
              maxLength={200}
              style={{ width: "55%" }}
            />
          </Form.Item>
          <Row justify="end">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editMode ? "Atualizar" : "Salvar"}
                </Button>
                <Button
                  type="danger"
                  htmlType="button"
                  onClick={() => history.goBack()}
                >
                  Cancelar
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </Col>
  );
};

export default CadConsult;
