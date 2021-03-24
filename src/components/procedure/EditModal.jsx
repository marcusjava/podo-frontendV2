import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Spin,
  message,
  Tooltip,
  Space,
  Row,
  Col,
} from "antd";
import { FcManager } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import {
  saveProcedure,
  updateProcedure,
} from "../../redux/actions/procedureActions";

import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import axios from "axios";

const { Option } = Select;

const EditModal = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [services, setServices] = useState([]);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { success, error } = useSelector((state) => state.procedure.procedure);

  useEffect(() => {
    async function getServices() {
      const response = await axios.get("/services");
      setServices(response.data);
    }

    getServices();
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0 && visible) {
      form.setFieldsValue({
        _id: data.key,
        service: data.service._id,
        name: data.name,
        price: data.price,
        description: data.description,
      });
    }
  }, [visible, data]);

  useEffect(() => {
    if (success && visible) {
      message.success("Procedimento salvo com sucesso");
      setVisible(false);
      form.resetFields();
    }

    if (Object.keys(error).length > 0 && visible) {
      message.error(error.message);
      form.setFields([{ name: error.path, errors: [error.message] }]);
    }
  }, [error, success]);

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        service: Yup.string().ensure().required("Campo obrigatorio"),
        name: Yup.string().required("Preencha o procedimento"),
      });
      await schema.validate(data, { abortEarly: false });
      const sendData = {
        service: data.service,
        name: data.name,
        price: data.price,
        description: data.description,
      };
      dispatch(updateProcedure(sendData, data._id));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((erro) => {
          form.setFields([{ name: erro.path, errors: [erro.message] }]);
        });
      }
    }
  };

  const onClose = (e) => {
    form.resetFields();
  };

  const onCancel = (e) => {
    form.resetFields();
    setVisible(false);
  };

  const buttonType = (
    <Tooltip title="Editar">
      <MdEdit
        size={18}
        onClick={() => setVisible(true)}
        style={{ cursor: "pointer" }}
      />
    </Tooltip>
  );

  return (
    <div>
      {buttonType}
      <Modal
        title="Cadastro Procedimentos"
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
            name="service"
            label="Serviço"
            rules={[
              {
                required: true,
                message: "Informe o serviço",
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Selecione um serviço"
              optionFilterProp="children"
              notFoundContent={
                services.length === 0 ? <Spin size="small" /> : null
              }
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {services.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Nome Procedimento"
            rules={[
              {
                required: true,
                message: "Informe o nome",
              },
            ]}
          >
            <Input style={{ width: 500 }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Preço"
            rules={[
              {
                pattern: /^(?:\d*)$/,
                message: "Somente numeros",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input style={{ width: 60 }} maxLength={4} />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <Input.TextArea />
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
      </Modal>
    </div>
  );
};

export default EditModal;
