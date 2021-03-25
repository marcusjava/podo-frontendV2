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
import { updateConsult } from "../../redux/actions/consultActions";
import { getClients } from "../../redux/actions/clientActions";
import { getProcedures } from "../../redux/actions/procedureActions";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Spinner from "../../components/layout/Spinner";

const { Option } = Select;

const { TextArea } = Input;

const EditConsult = () => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [price, setPrice] = useState(0);
  const [anamnese, setAnamnese] = useState({});

  const history = useHistory();

  const { id } = useParams();

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { procedures } = useSelector((state) => state.procedure);

  const { clients } = useSelector((state) => state.client);

  const { success, error } = useSelector((state) => state.consult.consult);

  const getConsult = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/consults/${id}`);
      const { data } = response;
      setItem(data);
      setSelectedKeys(data.procedures.map((p) => p._id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Ocorreu um erro ao recuperar a consulta");
      history.goBack();
    }
  };

  useEffect(() => {
    dispatch(getProcedures());
    dispatch(getClients({ limit: 50 }));
    getConsult(id);

    return function clean() {
      dispatch({ type: "CLEAR_CONSULT_STATE" });
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      message.success("Consulta salva com sucesso");
      history.goBack();
    }

    if (error) {
      form.setFields([{ name: error.path, errors: [error.message] }]);
    }
  }, [error, success]);

  const filterOption = (inputValue, option) =>
    option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  const handleSubmit = async (data) => {
    const {
      _id,
      date,
      client,
      observations,
      procedures,
      price,
      status,
      type_consult,
    } = data;

    const sendData = {
      _id,
      date: dayjs(date).format("YYYY-MM-DD HH:mm"),
      client,
      procedures,
      anamnese,
      price,
      observations,
      status,
      type_consult,
    };
    dispatch(updateConsult(sendData, data._id));
  };

  const handleSearch = (value) => {
    if (value === "") {
      dispatch(getClients({ limit: 50 }));
    }
    if (value.length > 3) {
      dispatch(getClients({ name: value }));
    }
  };

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

  if (loading || Object.keys(item).length === 0) {
    return <Spinner />;
  }

  return (
    <Col md={16}>
      <Card title="Editar Consulta" bordered={false}>
        <Form
          name="edit-consult"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            _id: item._id,
            date: dayjs(item.date),
            client: item.client._id,
            procedures: item.procedures.map((p) => p._id),
            anamnese: item.anamnese,
            price: item.price,
            type_consult: item.type_consult,
            status: item.status,
            observations: item.observations,
          }}
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
              allowClear
              onSearch={handleSearch}
              onClear={() => dispatch(getClients({ limit: 50 }))}
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

          <Form.Item
            name="procedures"
            label="Procedimentos"
            rules={[
              {
                required: true,
                message: "Informe ao menos um procedimento",
              },
            ]}
          >
            <Transfer
              rowKey={(record) => record._id}
              targetKeys={selectedKeys}
              listStyle={{
                width: 500,
                height: 500,
              }}
              dataSource={procedures.items}
              showSearch
              filterOption={filterOption}
              render={(item) => `${item.name} - R$ ${item.price}`}
              onChange={handleChange}
            />
          </Form.Item>

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
                  Atualizar
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

export default EditConsult;
