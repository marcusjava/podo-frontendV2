import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Input, Button } from "antd";
import "./styles.css";
import Logo from "../../images/Logo2.png";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../../redux/actions/userActions";
import * as Yup from "yup";

const Login = () => {
  const dispatch = useDispatch();
  const { authenticated, error } = useSelector((state) => state.auth.user);
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    if (authenticated) {
      history.push("/home");
    }
  }, [authenticated]);

  useEffect(() => {
    if (error) {
      const { path, message } = error;
      form.setFields([{ name: path, errors: [message] }]);
    }
  }, [error]);

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Formato incorreto"),
        password: Yup.string().required("Informe a senha"),
      });
      await schema.validate(data, { abortEarly: false });
      dispatch(login(data));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((erro) => {
          form.setFields([{ name: erro.path, errors: [erro.message] }]);
        });
      }
    }
  };

  return (
    <div className="login">
      <div className="dark-overlay login-inner text-light">
        <Row justify="center" align="center" className="container">
          <Col span={8}>
            <Row justify="center" align="center">
              <img src={Logo} className="logo" alt="Logo" />
            </Row>
            <Row justify="center">
              <Form
                name="login"
                form={form}
                onFinish={handleSubmit}
                className="login-form"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Informe o email",
                    },
                  ]}
                >
                  <Input
                    style={{ width: 400 }}
                    placeholder="Informe o Email"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Informe a senha",
                    },
                  ]}
                >
                  <Input.Password
                    style={{ width: 400 }}
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Informe a Senha"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                >
                  Entrar
                </Button>
              </Form>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
