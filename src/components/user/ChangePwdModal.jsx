import React, { useState, useEffect } from "react";
import { Modal, Button, Tooltip, Form, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { KeyOutlined } from "@ant-design/icons";
import axios from "axios";
import * as Yup from "yup";

// import { Container } from './styles';

function ChangePwdModal() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        password: Yup.string()
          .required("Senha obrigatoria!")
          .oneOf([Yup.ref("password2"), null], "Senhas não conferem!"),
        password2: Yup.string().required("Informe confirmação de senha"),
      });
      await schema.validate(data, { abortEarly: false });
      const response = await axios.post(`/users/change_pwd`, data);
      if (response.status === 200) {
        message.success("Senha alterada com sucesso.");
        setVisible(false);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((erro) => {
          form.setFields([{ name: erro.path, errors: [erro.message] }]);
        });
        return;
      }
      const { path, message } = error.response.data;
      form.setFields([{ name: path, errors: [message] }]);
    }
  };

  const onClose = (e) => {
    form.resetFields();
  };

  const onCancel = (e) => {
    form.resetFields();
  };

  return (
    <>
      <Tooltip title="Alterar Senha">
        <Button
          icon={<KeyOutlined size={18} />}
          onClick={() => setVisible(true)}
        >
          Alterar senha
        </Button>
      </Tooltip>
      <Modal
        title="Alterar Senha"
        visible={visible}
        centered
        destroyOnClose
        footer={null}
        onCancel={() => setVisible(false)}
        afterClose={onClose}
        forceRender
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item>
            <Form.Item
              name="actual"
              label="Senha atual"
              rules={[
                {
                  required: true,
                  message: "Informe a senha atual",
                },
              ]}
            >
              <Input.Password
                placeholder="Senha atual"
                style={{ width: "75%" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Nova Senha"
              rules={[
                {
                  required: true,
                  message: "Informe a nova senha",
                },
              ]}
            >
              <Input.Password
                placeholder="Nova Senha"
                style={{ width: "75%" }}
              />
            </Form.Item>
            <Form.Item
              name="password2"
              label="Confirma nova senha"
              rules={[
                {
                  required: true,
                  message: "Confirme a nova senha",
                },
              ]}
            >
              <Input.Password
                placeholder="Confirma nova senha"
                style={{ width: "75%" }}
              />
            </Form.Item>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Atualizar
          </Button>
          <Button type="danger" htmlType="button" onClick={onCancel}>
            Limpar
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default ChangePwdModal;
