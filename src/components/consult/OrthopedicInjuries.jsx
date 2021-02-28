import React, { useEffect, useState } from "react";
import { Form, Input, Select, Spin, Card, Row, Col, Image } from "antd";
import { LESOES_ORTO_JSON } from "./AnamneseJSON";
import "./styles.css";

const { Option } = Select;

const { TextArea } = Input;

export default function OrthopedicInjuries() {
  const [ortho, setOrtho] = useState([]);

  useEffect(() => {
    setOrtho(LESOES_ORTO_JSON);
  }, []);

  const list =
    ortho.length > 0 &&
    ortho.map((item, index) => {
      return (
        <Col xxl={4} xl={8} lg={12} sm={24} key={index}>
          <Card
            hoverable
            bordered={true}
            className="card"
            cover={<Image width={150} height={150} src={item.imgSrc} />}
          >
            <p>{item.fieldName}</p>
            <Form.Item name={["anamnese", "orto_lesoes", `${item.field}`]}>
              <Select
                showSearch
                mode="multiple"
                notFoundContent={
                  item.options.length === 0 ? <Spin size="small" /> : null
                }
                style={{ width: 200 }}
                placeholder="Selecione..."
              >
                {item.options.map((opt, index) => (
                  <Option color="lime" key={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Card>
        </Col>
      );
    });

  return (
    <div>
      <div style={{ marginBottom: 25 }}>
        <h3>Lesoes Ortopedicas</h3>
      </div>
      <Row>{list}</Row>
      <Row>
        <Col xxl={12} xl={12} lg={12} sm={24}>
          <Form.Item
            label="Outras lesões"
            name={["anamnese", "orto_lesoes", "outros"]}
            style={{ width: "500px", marginTop: 25 }}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
