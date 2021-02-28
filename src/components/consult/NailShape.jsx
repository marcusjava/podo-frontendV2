import React, { useEffect, useState } from "react";
import { Form, Select, Spin, Card, Row, Col, Image } from "antd";
import { FORMATO_UNHAS_JSON, NOMENCLATURA_DEDOS_PE } from "./AnamneseJSON";
import "./styles.css";

const { Option } = Select;

export default function NailShape() {
  const [nails, setNails] = useState([]);
  const [finger, setFinger] = useState([]);

  useEffect(() => {
    setNails(FORMATO_UNHAS_JSON);
    setFinger(NOMENCLATURA_DEDOS_PE);
  }, []);

  const list =
    nails &&
    nails.map((item, index) => (
      <Col xxl={4} xl={8} lg={12} sm={24} key={index}>
        <Card
          hoverable
          bordered={true}
          className="card"
          cover={<Image width={150} src={item.imgSrc} />}
        >
          <p>{item.fieldName}</p>
          <Form.Item name={["anamnese", "unhas_formato", `${item.field}`]}>
            <Select
              showSearch
              mode="multiple"
              notFoundContent={
                finger.length === 0 ? <Spin size="small" /> : null
              }
              style={{ width: "95%" }}
              placeholder="Selecione..."
            >
              {finger.map((item, index) => (
                <Option color="lime" key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>
      </Col>
    ));

  return (
    <div>
      <div style={{ marginBottom: 25 }}>
        <h3>Formato das Unhas</h3>
      </div>
      <Row>{list}</Row>
    </div>
  );
}
