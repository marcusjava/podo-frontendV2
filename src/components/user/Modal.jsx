import React, { useState, useEffect } from "react";
import {
  Modal,
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
  Tooltip,
  Checkbox,
} from "antd";
import { FcManager } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import { register, updateUser } from "../../redux/actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import UploadFile from "../upload";
import * as Yup from "yup";
import dayjs from "dayjs";
import MaskedInput from "antd-mask-input";
const { Option } = Select;

/* 
  TODO
  - Limitar campos ok
  - Incluir mascara ok
  - Corrigir data nasc ok
  - Verificar senha no cadastro e atualização



*/

const PWD_DEFAULT = process.env.REACT_APP_DEFAULT_PWD;

const UserModal = ({ editMode = false, data }) => {
  const [visible, setVisible] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uf, setUF] = useState([]);
  const [city, setCity] = useState([]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { success, error, item } = useSelector((state) => state.auth.user);

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
    if (editMode && visible) {
      form.setFieldsValue({
        id: data.key,
        name: data.name,
        phone: data.phone,
        nasc: dayjs(data.nasc),
        cpf: data.cpf,
        rg: data.rg,
        email: data.email,
        address: {
          street: data.address.street,
          neighborhood: data.address.neighborhood,
          state: data.address.state,
          city: data.address.city,
          cep: data.address.cep,
        },
        role: data.role,
        status: data.status,
      });
    }
  }, [data, editMode, form, visible]);

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
      const newUser = new FormData();

      newUser.append("thumbnail", selectedFile);
      newUser.append("name", data.name);
      newUser.append("phone", data.phone);
      newUser.append("nasc", dayjs(data.nasc).format("YYYY-MM-DD"));
      newUser.append("cpf", data.cpf);
      newUser.append("rg", data.rg || "");
      newUser.append("email", data.email);
      newUser.append("address", JSON.stringify(data.address));
      newUser.append("role", data.role);
      newUser.append("status", data.status);
      if (editMode) {
        if (data.pwdReset !== "") {
          newUser.append("password", PWD_DEFAULT);
        }
        dispatch(updateUser(newUser, data.id));
        message.success("Usuario atualizado com sucesso");
        setVisible(false);
        form.resetFields();
      } else {
        const verifyPwd = Yup.object().shape({
          password: Yup.string()
            .required("Senha obrigatoria!")
            .oneOf([Yup.ref("password2"), null], "Senhas não conferem!"),
          password2: Yup.string().required("Informe confirmação de senha"),
        });
        await verifyPwd.validate(data, { abortEarly: false });
        newUser.append("password", data.password);
        newUser.append("password2", data.password2);
        dispatch(register(newUser));
        message.success("Usuario salvo com sucesso");
        setVisible(false);
        form.resetFields();
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((erro) => {
          form.setFields([{ name: erro.path, errors: [erro.message] }]);
        });
      } else {
        form.setFields([{ name: error.path, errors: [error.message] }]);
      }
    }
  };

  const onClose = (e) => {
    form.resetFields();
    setSelectedFile(null);
  };

  const onCancel = (e) => {
    form.resetFields();
    setSelectedFile(null);
  };

  const onChangeUF = (value) => {
    getCity(value);
  };

  const buttonType = editMode ? (
    <Tooltip title="Editar">
      <MdEdit
        size={18}
        onClick={() => setVisible(true)}
        style={{ cursor: "pointer" }}
      />
    </Tooltip>
  ) : (
    <Button
      type="primary"
      icon={<FcManager size={18} />}
      onClick={() => setVisible(true)}
      style={{ fontSize: "16px" }}
    >
      Novo
    </Button>
  );

  return (
    <div>
      {buttonType}
      <Modal
        title={editMode ? "Editar Usuario" : "Cadastro Usuario"}
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
        <Form
          name="new-user"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Row justify="center">
            <Col span={4} style={{ textAlign: "center" }}>
              <UploadFile
                onFileUpload={setSelectedFile}
                imageURL={editMode ? data.avatar_url : null}
              />
            </Col>
          </Row>
          <Form.Item name="id">
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
              <MaskedInput mask="11111111" />
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
              <MaskedInput mask="11111111111" />
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
              <MaskedInput mask="(11)11111-1111" style={{ width: 150 }} />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name={["address", "street"]}
              label="Rua"
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["address", "neighborhood"]}
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
              label="Estado"
              style={{
                display: "inline-block",
                width: "20%",
                marginRight: "5px",
              }}
            >
              <Select
                showSearch
                onChange={(value) => onChangeUF(value)}
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
              style={{ display: "inline-block", width: "calc(25% - 8px)" }}
            >
              <MaskedInput mask="11111111" style={{ width: 150 }} />
            </Form.Item>
          </Form.Item>
          {!editMode ? (
            <Form.Item>
              <Form.Item
                name="password"
                label="Senha"
                rules={[
                  {
                    required: editMode ? false : true,
                    message: "Informe a senha",
                  },
                ]}
                style={{ display: "inline-block", width: "calc(25% - 8px)" }}
              >
                <Input.Password placeholder="Senha" />
              </Form.Item>
              <Form.Item
                name="password2"
                label="Confirma senha"
                rules={[
                  {
                    required: editMode ? false : true,
                    message: "Confirme a senha",
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(25% - 8px)",
                  margin: "0 8px",
                }}
              >
                <Input.Password placeholder="Confirma Senha" />
              </Form.Item>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="pwdReset"
                style={{ marginBottom: "0px" }}
                valuePropName="checked"
              >
                <Checkbox>"Resetar senha"</Checkbox>
              </Form.Item>
              <small style={{ color: "red" }}>Senha padrão nanapodo</small>
            </>
          )}

          <Form.Item>
            <Form.Item
              name="role"
              label="Grupo"
              rules={[
                {
                  required: true,
                  message: "Informe a qual grupo o usuario pertence",
                },
              ]}
              style={{
                display: "inline-block",
                width: "calc(25% - 8px)",
                margin: "0 8px",
              }}
            >
              <Select placeholder="Selecione o grupo">
                <Option key="Usuario">Usuario</Option>
                <Option key="Administrador">Administrador</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              initialValue="Ativo"
              style={{ display: "inline-block", width: "calc(25% - 8px)" }}
            >
              <Select placeholder="Selecione">
                <Option key="Ativo">Ativo</Option>
                <Option key="Inativo">Inativo</Option>
              </Select>
            </Form.Item>
          </Form.Item>
          <Row justify="end">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editMode ? "Atualizar" : "Salvar"}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserModal;
