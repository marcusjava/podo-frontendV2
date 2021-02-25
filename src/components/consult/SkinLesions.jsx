import React, { useEffect, useState } from "react";
import { Form, Input, Select, Spin, Card, Row, Col, Image } from "antd";
import { LESOES_PELE_JSON, NOMENCLATURA_DEDOS_PE } from "./AnamneseJSON";
import "./styles.css";

const { Option } = Select;

const { TextArea } = Input;

export default function SkinLesions() {
  const [skins, setSkins] = useState([]);

  useEffect(() => {
    setSkins(LESOES_PELE_JSON);
  }, []);

  const list =
    skins &&
    skins.map((item, index) => (
      <Col xxl={4} xl={8} lg={12} sm={24} key={index}>
        <Card
          hoverable
          bordered={true}
          style={{ width: 300 }}
          className="card"
          cover={<Image width={150} src={item.imgSrc} />}
        >
          <p>{item.fieldName}</p>
          <Form.Item name={["anamnese", "pele_lesoes", `${item.field}`]}>
            <Select
              showSearch
              mode="multiple"
              notFoundContent={
                item.options.length === 0 ? <Spin size="small" /> : null
              }
              style={{ width: "95%" }}
              placeholder="Selecione..."
            >
              {item.options.map((opt, index) => (
                <Option key={opt}>{opt}</Option>
              ))}
            </Select>
          </Form.Item>
        </Card>
      </Col>
    ));

  return (
    <div>
      <div style={{ marginBottom: 25 }}>
        <h3>Lesoes na Pele</h3>
      </div>
      <Row>{list}</Row>
      <Row>
        <Col xxl={12} xl={12} lg={12} sm={24}>
          <Form.Item
            label="Outras lesões"
            name={["anamnese", "pele_lesoes", "outros"]}
            style={{ marginTop: 25 }}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
