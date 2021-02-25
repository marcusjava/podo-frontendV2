import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Row,
  Col,
  message,
  Space,
  DatePicker,
  Card,
} from "antd";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import UploadFile from "../../components/upload";
import InputMask from "react-input-mask";
import { saveClient } from "../../redux/actions/clientActions";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import * as Yup from "yup";
const { Option } = Select;

/* 
	TODO

	- Adicionar yup para validação
	- Verificar e exibir erros do servidor


*/

const CadClient = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uf, setUF] = useState([]);
  const [selectedUF, setSelectedUF] = useState("");
  const [city, setCity] = useState([]);

  const [form] = Form.useForm();

  const { id } = useParams();

  const history = useHistory();

  const dispatch = useDispatch();

  const { success, error } = useSelector((state) => state.client.client);

  useEffect(() => {
    async function getUF() {
      const response = await axios.get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      setUF(response.data);
    }

    getUF();

    return () => {
      dispatch({ type: "CLEAR_CLIENT_STATE" });
    };
  }, []);

  useEffect(() => {
    form.setFieldsValue({ address: { city: undefined } });
    async function getCity() {
      if (selectedUF === "") return;
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      );
      setCity(response.data);
    }
    getCity();
  }, [selectedUF]);

  useEffect(() => {
    if (success) {
      message.success("Cliente salvo com sucesso");
      form.resetFields();
      history.goBack();
    }

    if (Object.keys(error).length > 0) {
      message.error("Ocorreu um erro", [error.message]);
      form.setFields([{ name: error.path, errors: [error.message] }]);
    }
  }, [error, success]);

  const handleSubmit = async (client) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Nome obrigatorio"),
        cpf: Yup.string().required("Informe o cpf"),
        address: Yup.object().shape({
          street: Yup.string().required("Rua obrigatoria"),
          neighborhood: Yup.string().required("Bairro obrigatorio"),
          city: Yup.string().required("Cidade obrigatoria"),
          state: Yup.string().required("Estado obrigatoria"),
        }),
      });
      await schema.validate(client, { abortEarly: false });
      const newClient = new FormData();
      newClient.append("id", client.id);
      newClient.append("thumbnail", selectedFile);
      newClient.append("name", client.name);
      newClient.append("email", client.email || "");
      newClient.append("contact", client.contact);
      newClient.append("instagram", client.instagram || "");
      newClient.append("cpf", client.cpf);
      newClient.append("nasc", moment(client.nasc).format("YYYY-MM-DD"));
      newClient.append("address", JSON.stringify(client.address));
      newClient.append("occupation", client.occupation || "");
      newClient.append("sex", client.sex || "");
      newClient.append("etnia", client.etnia || "");
      dispatch(saveClient(newClient));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((erro) => {
          form.setFields([{ name: erro.path, errors: [erro.message] }]);
        });
      }
    }
  };
  return (
    <Col md={16}>
      <Card bordered={false}>
        <Form name="client" form={form} onFinish={handleSubmit}>
          <Row justify="center">
            <Col span={4} style={{ textAlign: "center", marginTop: "15px" }}>
              <UploadFile onFileUpload={setSelectedFile} />
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
                onChange={(value) => setSelectedUF(value)}
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
                disabled={selectedUF === ""}
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

export default CadClient;
