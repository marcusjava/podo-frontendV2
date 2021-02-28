import React from "react";
import { Form, Input, Col } from "antd";

// import { Container } from './styles';

function PhysicalExam() {
  return (
    <div>
      <div style={{ marginBottom: 25 }}>
        <h3>Exame Fisico</h3>
      </div>
      <Col>
        <Form.Item>
          <Form.Item
            name={["anamnese", "exame_fisico", "monofilamento"]}
            label="Monofilamento"
            style={{ display: "inline-block", width: "20" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["anamnese", "exame_fisico", "diapasao"]}
            label="Diapasão"
            style={{
              display: "inline-block",
              width: "20%",
              margin: "0 18px",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["anamnese", "exame_fisico", "digitopressao"]}
            label="Digitopressão"
            style={{
              display: "inline-block",
              width: "20%",
              margin: "0 18px",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["anamnese", "exame_fisico", "pulsos"]}
            label="Pulsos"
            style={{
              display: "inline-block",
              width: "20%",
              margin: "0 18px",
            }}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Col>
    </div>
  );
}

export default PhysicalExam;
