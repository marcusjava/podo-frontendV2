import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  message,
  Tooltip,
  Space,
  Row,
  Col,
} from "antd";
import { FcManager } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import { saveService, updateService } from "../../redux/actions/serviceActions";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
const { TextArea } = Input;

const ServiceModal = ({ editMode = false, initial }) => {
  const [visible, setVisible] = useState(false);
  const { success, error } = useSelector((state) => state.service.service);

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (editMode && visible && initial) {
      form.setFieldsValue({
        id: initial.key,
        description: initial.description,
        observations: initial.observations,
      });
    }
  }, [editMode, visible, initial]);

  useEffect(() => {
    if (success && visible) {
      message.success("Serviço salvo com sucesso");
      form.resetFields();
      setVisible(false);
    }

    if (Object.keys(error).length > 0 && visible) {
      message.error(error.message);
      form.setFields([{ name: error.path, errors: [error.message] }]);
    }
  }, [success, error]);

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().required("Descrição obrigatoria"),
      });
      await schema.validate(data, { abortEarly: false });

      editMode
        ? dispatch(updateService(data, data.id))
        : dispatch(saveService(data));
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
        title="Cadastro Serviços"
        visible={visible}
        centered
        destroyOnClose
        footer={null}
        onCancel={onCancel}
        afterClose={onClose}
        forceRender
        style={{ top: 20 }}
        width={900}
      >
        <Form name="new-service" form={form} onFinish={handleSubmit}>
          <Form.Item name="id">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              {
                required: true,
                message: "Informe a descrição",
              },
            ]}
          >
            <Input placeholder="Informe o Nome" style={{ width: 500 }} />
          </Form.Item>
          <Form.Item name="observations" label="Observações">
            <TextArea rows={4} />
          </Form.Item>
          <Row justify="end">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editMode ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="danger" htmlType="button" onClick={onCancel}>
                  Sair
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceModal;
