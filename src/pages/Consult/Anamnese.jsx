import React, { useEffect, useRef, useState } from "react";
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
  Avatar,
  Row,
  Col,
  Checkbox,
  InputNumber,
} from "antd";
import {
  saveConsult,
  updateConsult,
  getConsult,
} from "../../redux/actions/consultActions";
import { getClients } from "../../redux/actions/clientActions";
import { getProcedures } from "../../redux/actions/procedureActions";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/common/Spinner";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Upload from "../../components/UploadDrop";
import NailShape from "../../components/consult/NailShape";
import NailLesions from "../../components/consult/NailLesions";
import SkinLesions from "../../components/consult/SkinLesions";
import OrthopedicInjuries from "../../components/consult/OrthopedicInjuries";
import PhysicalExam from "../../components/consult/PhysicalExam";

const { Option } = Select;

const { TextArea } = Input;

const Anamnese = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [consult, setConsult] = useState({});
  const [price, setPrice] = useState(0);

  const history = useHistory();

  const { id } = useParams();

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { procedures } = useSelector((state) => state.procedure);

  const { success, error } = useSelector((state) => state.consult.consult);

  useEffect(() => {
    dispatch(getProcedures());
    dispatch(getClients());

    return function clean() {
      dispatch({ type: "CLEAR_CONSULT_STATE" });
    };
  }, [dispatch]);

  useEffect(() => {
    async function getConsult(id) {
      const response = await axios.get(`/consults/${id}`);
      const { data } = response;
      console.log("dados do backend", data);
      setConsult(data);
      setSelectedKeys(data.procedures.map((item) => item._id));
      setPrice(parseInt(data.price));
    }
    if (id) {
      getConsult(id);
    }
  }, [id]);

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
    setSelectedKeys(keys);
    keys.forEach((key) => {
      //pesquisar as procedures
      const procObj = items.find((item) => item._id === key);
      setPrice((total) => total + parseInt(procObj.price));
    });
  };

  const handleSubmit = async (data) => {
    console.log("dados do submit", data);
    const { _id, date, client, anamnese, observations, type_consult } = data;
    if (selectedKeys.length === 0) {
      message.error("Selecione ao menos um procedimento");
      return;
    }

    const sendData = {
      _id,
      date: moment(date).format("YYYY-MM-DD HH:mm"),
      end_date: moment(Date.now()).format("YYYY-MM-DD HH:mm"),
      client,
      procedures: selectedKeys,
      price: price,
      anamnese,
      observations,
      status: "Realizada",
      type_consult,
    };

    dispatch(updateConsult(sendData, data._id));
  };

  if (Object.entries(consult).length === 0) {
    return <Spinner />;
  }

  return (
    <Card title="Realizar Consulta" bordered={false}>
      <Row justify="center">
        <Col style={{ textAlign: "center" }}>
          <Avatar src={consult.client.avatar_url} size={250} />
          <h2>{consult.client.name}</h2>
        </Col>
      </Row>
      <Form
        name="consult"
        initialValues={{
          _id: consult._id,
          date: moment(consult.date),
          client: consult.client._id,
          type_consult: consult.type_consult,
          anamnese: consult.anamnese,
          observations: consult.observations,
        }}
        form={form}
        onFinish={handleSubmit}
        preserve={true}
      >
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="client">
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

        <div style={{ marginBottom: 25 }}>
          <h4>Procedimentos</h4>
          <Transfer
            rowKey={(record) => record._id}
            listStyle={{
              width: 350,
              height: 450,
            }}
            dataSource={procedures.items}
            targetKeys={selectedKeys}
            showSearch
            filterOption={filterOption}
            render={(item) => `${item.name} - R$ ${item.price}`}
            onChange={handleChange}
          />
        </div>

        <h1>Total {price}</h1>

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
            <Option key="Urgência">Urgência</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="observations"
          label="Observações"
          style={{ width: 900 }}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Col style={{ marginBottom: 25 }}>
          <h4>Fotos</h4>
          <Upload id={id} />
        </Col>

        <Col style={{ marginBottom: 25 }}>
          <h3>Anamnese</h3>
        </Col>
        <Form.Item
          name={["anamnese", "desc_proc"]}
          label="Descrição do procedimento"
          style={{ width: "70%" }}
        >
          <TextArea rows={6} />
        </Form.Item>

        <Col>
          <Form.Item>
            <Form.Item
              name={["anamnese", "esporte", "option"]}
              style={{ display: "inline-block", width: "10%" }}
              valuePropName="checked"
            >
              <Checkbox>Esportes?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "esporte", "qt"]}
              label="Quant."
              style={{
                display: "inline-block",
                width: "5%",
                marginRight: "40px",
              }}
            >
              <InputNumber min={0} max={7} />
            </Form.Item>

            <Form.Item
              name={["anamnese", "pe_predominante"]}
              label="Canhoto/Destro"
              style={{
                display: "inline-block",
                width: "10%",
                marginRight: "40px",
              }}
            >
              <Select>
                <Option key="Canhoto">Canhoto</Option>
                <Option key="Destro">Destro</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={["anamnese", "calcado", "num"]}
              label="Num. calç"
              style={{
                display: "inline-block",
                width: "5%",
                marginRight: "40px",
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["anamnese", "calcado", "tipo"]}
              label="Tipo calçado"
              style={{
                display: "inline-block",
                width: "10%",
                marginRight: "40px",
              }}
            >
              <Select>
                <Option key="Alto">Alto</Option>
                <Option key="Bota">Bota</Option>
                <Option key="Confort">Confort</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={["anamnese", "calcado", "material"]}
              label="Material calçado"
              style={{
                display: "inline-block",
                width: "10%",
                marginRight: "40px",
              }}
            >
              <Select>
                <Option key="Sintetico">Sintetico</Option>
                <Option key="Couro">Couro</Option>
                <Option key="Confort">Confort</Option>
              </Select>
            </Form.Item>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Form.Item
              name={["anamnese", "medicamento", "option"]}
              style={{ display: "inline-block", width: "calc(10% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Medicamento?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "medicamento", "description"]}
              style={{
                display: "inline-block",
                width: "calc(40% - 8px)",
                marginRight: "25px",
              }}
              label="Quais?"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["anamnese", "alergia", "option"]}
              style={{ display: "inline-block", width: "calc(7% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Alergia?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "alergia", "description"]}
              style={{ display: "inline-block", width: "calc(40% - 8px)" }}
              label="Quais?"
            >
              <Input />
            </Form.Item>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Form.Item
              name={["anamnese", "doenca", "option"]}
              style={{ display: "inline-block", width: "calc(10% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Doença?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "doenca", "description"]}
              style={{
                display: "inline-block",
                width: "calc(40% - 8px)",
                marginRight: "25px",
              }}
              label="Quais?"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["anamnese", "diabetico"]}
              style={{ display: "inline-block", width: "calc(8% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Diabetico?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "diabetico_familia"]}
              style={{ display: "inline-block", width: "calc(10% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Diabetico familia?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "hipertensao"]}
              style={{ display: "inline-block", width: "calc(9% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Hipertenso?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "cardiopata"]}
              style={{ display: "inline-block", width: "calc(9% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Cardiopata?</Checkbox>
            </Form.Item>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Form.Item
              name={["anamnese", "fumante"]}
              style={{ display: "inline-block", width: "calc(8% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Fumante?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "etilista"]}
              style={{ display: "inline-block", width: "calc(10% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Etilista?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "dst"]}
              style={{ display: "inline-block", width: "calc(34% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>DST?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "grav_lact"]}
              style={{ display: "inline-block", width: "calc(12% - 8px)" }}
              valuePropName="checked"
            >
              <Checkbox>Gravidez/Lactação?</Checkbox>
            </Form.Item>
            <Form.Item
              name={["anamnese", "outros"]}
              style={{ display: "inline-block", width: "calc(35% - 8px)" }}
              label="Outros?"
            >
              <Input />
            </Form.Item>
          </Form.Item>
        </Col>

        <NailShape />

        <NailLesions />
        <SkinLesions />

        <OrthopedicInjuries />

        <PhysicalExam />

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
      </Form>
    </Card>
  );
};

export default Anamnese;
