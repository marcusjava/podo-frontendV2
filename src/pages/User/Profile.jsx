import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Spin,
  Row,
  Space,
  Col,
  Card,
  DatePicker,
} from "antd";
import Spinner from "../../components/common/Spinner";
import { updateUser, getUser } from "../../redux/actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import UploadFile from "../../components/upload";
import ChangePwdModal from "../../components/user/ChangePwdModal";
import * as Yup from "yup";
import dayjs from "dayjs";
import MaskedInput from "antd-mask-input";
import { useParams } from "react-router-dom";
const { Option } = Select;

// import { Container } from './styles';

function Profile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uf, setUF] = useState([]);
  const [selectedUF, setSelectedUF] = useState("");
  const [city, setCity] = useState([]);

  const { id } = useParams();

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { item, loading } = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function getUF() {
      const response = await axios.get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      setUF(response.data);
    }
    dispatch(getUser(id));

    getUF();
  }, [dispatch, id]);

  useEffect(() => {
    async function getCity() {
      if (selectedUF === "") return;
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      );
      setCity(response.data);
    }
    getCity();
  }, [selectedUF]);

  const onCancel = (e) => {
    form.resetFields();
    setSelectedFile(null);
  };

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Nome obrigatorio"),
        email: Yup.string()
          .email("Formato incorreto!")
          .required("Email obrigatorio!"),
        cpf: Yup.string().required("Informe o cpf"),
        address: Yup.object().shape({
          street: Yup.string().required("Rua obrigatoria"),
          neighborhood: Yup.string().required("Bairro obrigatorio"),
          city: Yup.string().required("Cidade obrigatoria"),
          state: Yup.string().required("Estado obrigatoria"),
        }),
      });
      await schema.validate(data, { abortEarly: false });
      const profile = new FormData();

      profile.append("thumbnail", selectedFile);
      profile.append("name", data.name);
      profile.append("phone", data.phone);
      profile.append("nasc", dayjs(data.nasc).format("YYYY-MM-DD"));
      profile.append("cpf", data.cpf);
      profile.append("rg", data.rg || "");
      profile.append("email", data.email);
      profile.append("address", JSON.stringify(data.address));
      profile.append("role", data.role);
      profile.append("status", data.status);
      data.actual && profile.append("actual", data.actual);
      data.password && profile.append("password", data.password);
      data.password2 && profile.append("password2", data.password2);
      dispatch(updateUser(profile, data._id));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((erro) => {
          form.setFields([{ name: erro.path, errors: [erro.message] }]);
        });
      }
    }
  };

  if (loading || Object.keys(item).length === 0) {
    return (
      <Col md={16}>
        <Spinner />
      </Col>
    );
  }
  return (
    <Col md={16}>
      <Card bordered={false} style={{ paddingTop: "40px" }}>
        <Form
          name="new-user"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            _id: item._id,
            name: item.name,
            phone: item.phone,
            nasc: dayjs(item.nasc),
            cpf: item.cpf,
            rg: item.rg,
            email: item.email,
            address: {
              street: item.address.street,
              neighborhood: item.address.neighborhood,
              state: item.address.state,
              city: item.address.city,
              cep: item.address.cep,
            },
            role: item.role,
            status: item.status,
          }}
        >
          <Row justify="center">
            <Col span={4} style={{ textAlign: "center" }}>
              <UploadFile
                onFileUpload={setSelectedFile}
                imageURL={item.avatar_url}
              />
            </Col>
          </Row>
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Nome"
            style={{ width: "50%" }}
            rules={[
              {
                required: true,
                message: "Informe o Nome",
              },
            ]}
          >
            <Input placeholder="Informe o Nome" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            style={{ width: "40%" }}
            rules={[
              {
                required: true,
                message: "Informe o Email",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Informe o Email" />
          </Form.Item>

          <Form.Item>
            <Form.Item
              name="rg"
              label="RG"
              style={{
                display: "inline-block",
                width: "15%",
                marginRight: "15px",
              }}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: "Confirme o CPF" }]}
              style={{
                display: "inline-block",
                width: "15%",
                marginRight: "15px",
              }}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              name="nasc"
              label="Nasc."
              style={{
                display: "inline-block",
                width: "20%",
                marginRight: "15px",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe a Data Nascimento",
                },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Contato"
              style={{
                display: "inline-block",
                width: "20%",
              }}
              rules={[
                {
                  required: true,
                  message: "Informe ao menos um contato",
                },
              ]}
            >
              <MaskedInput
                placeholder="Somente numeros"
                mask="(11)11111-1111"
                style={{ width: 150 }}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name={["address", "street"]}
              rules={[{ required: true, message: "Informe a rua" }]}
              label="Rua"
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["address", "neighborhood"]}
              rules={[{ required: true, message: "Informe o bairro" }]}
              label="Bairro"
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 8px",
              }}
            >
              <Input />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Form.Item
              name={["address", "state"]}
              rules={[{ required: true, message: "Informe o Estado" }]}
              label="Estado"
              style={{
                display: "inline-block",
                width: "20%",
                marginRight: "5px",
              }}
            >
              <Select
                showSearch
                onChange={(value) => setSelectedUF(value)}
                notFoundContent={uf.length === 0 ? <Spin size="small" /> : null}
                style={{ width: 70 }}
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
              rules={[{ required: true, message: "Informe a Cidade" }]}
              label="Cidade"
              style={{
                display: "inline-block",
                width: "300px",
                marginRight: "5px",
              }}
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
              style={{ display: "inline-block", width: "calc(25% - 8px)" }}
            >
              <MaskedInput
                placeholder="Somente numeros"
                mask="11111111"
                style={{ width: 150 }}
              />
            </Form.Item>
          </Form.Item>
          <ChangePwdModal />

          <Form.Item>
            <Form.Item
              name="role"
              label="Grupo"
              style={{
                display: "inline-block",
                width: "calc(25% - 8px)",
                margin: "0 8px",
              }}
            >
              <Input disabled={true}></Input>
            </Form.Item>
          </Form.Item>
          <Row justify="end">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit">
                  Atualizar
                </Button>
                <Button type="danger" htmlType="button" onClick={onCancel}>
                  Limpar
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </Col>
  );
}

export default Profile;
