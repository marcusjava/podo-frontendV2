import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Row,
  Col,
  Space,
  message,
  DatePicker,
  Card,
} from "antd";
import axios from "axios";
import UploadFile from "../../components/upload";
import InputMask from "react-input-mask";
import { useHistory, useParams } from "react-router-dom";
import dayjs from "dayjs";

import Spinner from "../../components/layout/Spinner";

const { Option } = Select;

const EditClient = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uf, setUF] = useState([]);
  const [selectedUF, setSelectedUF] = useState("");
  const [city, setCity] = useState([]);

  const { id } = useParams();

  const [form] = Form.useForm();

  const history = useHistory();

  const getClient = async (id) => {
    setLoading(true);
    const response = await axios.get(`/clients/${id}`);
    const { data } = response;
    setData(data);
    setLoading(false);
  };

  const getUF = async () => {
    const response = await axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );
    setUF(response.data);
  };
  const getCity = async (value) => {
    form.setFieldsValue({ address: { city: undefined } });
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`
    );
    setCity(response.data);
  };

  useEffect(() => {
    getUF();
  }, []);

  useEffect(() => {
    getClient(id);
  }, [id]);

  const onChangeUF = (value) => {
    getCity(value);
  };

  const handleSubmit = async (client) => {
    const {
      id,
      name,
      email,
      contact,
      instagram,
      cpf,
      nasc,
      address,
      occupation,
      sex,
      etnia,
    } = client;
    const newClient = new FormData();
    newClient.append("id", id);
    newClient.append("thumbnail", selectedFile);
    newClient.append("name", name);
    newClient.append("email", email);
    newClient.append("contact", contact);
    newClient.append("instagram", instagram);
    newClient.append("cpf", cpf);
    newClient.append("nasc", dayjs(nasc).format("YYYY-MM-DD"));
    newClient.append("address", JSON.stringify(address));
    newClient.append("occupation", occupation);
    newClient.append("sex", sex);
    newClient.append("etnia", etnia);
    try {
      setLoading(true);
      const response = await axios.put(`/clients/${id}`, newClient);
      setLoading(false);
      console.log(response);
      if (response.status === 200) {
        message.success("Cliente salvo com sucesso");
        form.resetFields();
        history.push("/home/clientes");
      }
    } catch (error) {
      console.error(error);
      form.setFields([{ name: error.path, errors: [error.message] }]);
    }
  };
  return loading || Object.keys(data).length === 0 ? (
    <Spinner />
  ) : (
    <Col md={16}>
      <Card bordered={false}>
        <Form
          name="client"
          form={form}
          initialValues={{
            id: data._id,
            name: data.name,
            email: data.email,
            instagram: data.instagram,
            contact: data.contact,
            nasc: dayjs(data.nasc),
            cpf: data.cpf,

            address: {
              street: data.address.street,
              neighborhood: data.address.neighborhood,
              state: data.address.state,
              city: data.address.city,
              cep: data.address.cep,
            },
            occupation: data.occupation,
            sex: data.sex,
            etnia: data.etnia,
          }}
          onFinish={handleSubmit}
        >
          <Row justify="center">
            <Col span={4} style={{ textAlign: "center", marginTop: "15px" }}>
              <UploadFile
                onFileUpload={setSelectedFile}
                imageURL={data.avatar_url}
              />
            </Col>
          </Row>
          <Form.Item name="id">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="name"
              label="Nome"
              style={{
                display: "inline-block",
                width: "50%",
                marginRight: "45px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe o Nome",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              style={{
                display: "inline-block",
                width: "40%",
              }}
              rules={[
                {
                  required: false,
                  message: "Informe o Email",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="cpf"
              label="CPF"
              style={{
                display: "inline-block",
                width: "16%",
                marginRight: "25px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe o CPF",
                },
              ]}
            >
              <InputMask mask="99999999999">
                {(props) => <Input {...props} />}
              </InputMask>
            </Form.Item>

            <Form.Item
              name="contact"
              label="Contato"
              style={{
                display: "inline-block",
                width: "16%",
                marginRight: "25px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe o contato",
                },
              ]}
            >
              <InputMask mask="99 99999-9999">
                {(props) => <Input {...props} />}
              </InputMask>
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "15%",
                marginRight: "30px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe a Data Nascimento",
                },
              ]}
              name="nasc"
              label="Nasc."
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="instagram"
              label="Instagram"
              style={{
                display: "inline-block",
                width: "30%",
              }}
            >
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name={["address", "street"]}
              label="Rua"
              style={{
                display: "inline-block",
                width: "50%",
                marginRight: "45px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe a Rua",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["address", "neighborhood"]}
              label="Bairro"
              style={{
                display: "inline-block",
                width: "30%",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe o Bairro",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Form.Item
              name={["address", "state"]}
              label="Estado"
              style={{
                display: "inline-block",
                width: "5%",
                marginRight: "15px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe o Estado",
                },
              ]}
            >
              <Select
                showSearch
                onChange={(value) => onChangeUF(value)}
                notFoundContent={uf.length === 0 ? <Spin size="small" /> : null}
              >
                {uf.map((item) => (
                  <Option key={item.id} value={item.sigla}>
                    {item.sigla}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["address", "city"]}
              label="Cidade"
              style={{
                display: "inline-block",
                width: "calc(45% - 15px)",
                marginRight: "45px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe a Cidade",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecione"
                disabled={city.length === 0}
                notFoundContent={
                  city.length === 0 ? <Spin size="small" /> : null
                }
              >
                {city.map((item) => (
                  <Option key={item.id} value={item.nome}>
                    {item.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["address", "cep"]}
              label="CEP"
              style={{
                display: "inline-block",
                width: "10%",
              }}
            >
              <InputMask mask="99999999">
                {(props) => <Input {...props} />}
              </InputMask>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="occupation"
              label="Profissão"
              style={{
                display: "inline-block",
                width: "35%",
                marginRight: "15px",
              }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="sex"
              label="Sexo"
              style={{
                display: "inline-block",
                width: "calc(15% - 15px)",
                marginRight: "45px",
              }}
            >
              <Select placeholder="Selecione">
                <Option key="Masculino">Masculino</Option>
                <Option key="Feminino">Feminino</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="etnia"
              label="Etnia"
              style={{ display: "inline-block", width: "calc(15% - 8px)" }}
            >
              <Select placeholder="Selecione">
                <Option key="Branco">Branco</Option>
                <Option key="Pardo">Pardo</Option>
                <Option key="Negro">Negro</Option>
                <Option key="Amarelo">Amarelo</Option>
                <Option key="Indigena">Indigena</Option>
              </Select>
            </Form.Item>
          </Form.Item>
          <Row justify="end">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit">
                  Salvar
                </Button>
                <Button
                  type="danger"
                  htmlType="button"
                  onClick={() => form.resetFields()}
                >
                  Limpar
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </Col>
  );
};

export default EditClient;
