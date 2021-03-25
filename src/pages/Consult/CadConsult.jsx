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
import { saveConsult } from "../../redux/actions/consultActions";
import { getClients } from "../../redux/actions/clientActions";
import { getProcedures } from "../../redux/actions/procedureActions";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import Spinner from "../../components/layout/Spinner";

const { Option } = Select;

const { TextArea } = Input;

const CadConsult = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [price, setPrice] = useState(0);

  const history = useHistory();

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { procedures } = useSelector((state) => state.procedure);

  const { clients } = useSelector((state) => state.client);

  const { success, error, loading } = useSelector(
    (state) => state.consult.consult
  );

  useEffect(() => {
    dispatch(getProcedures());
    dispatch(getClients({ limit: 50 }));

    return function clean() {
      dispatch({ type: "CLEAR_CONSULT_STATE" });
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      message.success("Consulta salva com sucesso");
      form.resetFields();
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
    const {
      date,
      client,
      observations,
      procedures,
      price,
      status,
      type_consult,
    } = data;

    const sendData = {
      date: dayjs(date).format("YYYY-MM-DD HH:mm"),
      client,
      procedures,
      price,
      observations,
      status,
      type_consult,
    };
    dispatch(saveConsult(sendData));
  };

  const clearFields = () => {
    form.resetFields();
    setSelectedKeys([]);
  };

  const handleSearch = (value) => {
    if (value === "") {
      dispatch(getClients({ limit: 50 }));
    }
    if (value.length > 3) {
      dispatch(getClients({ name: value }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Col md={16}>
      <Card title="Cadastrar Consulta" bordered={false}>
        <Form
          name="new-consult"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "Marcada" }}
        >
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
                  Salvar
                </Button>
                <Button type="danger" htmlType="button" onClick={clearFields}>
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
