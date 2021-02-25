import React from "react";
import { Row, Col, Button } from "antd";
import Table from "../../components/client/Table";
import { Link } from "react-router-dom";
import { FcManager } from "react-icons/fc";
// import { Container } from './styles';

function Client() {
  return (
    <Col className="client" md={24}>
      <Row justify="end">
        <Col span={24}>
          <Link to="/home/clientes/adicionar">
            <Button icon={<FcManager />} type="primary">
              Adicionar
            </Button>
          </Link>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "30px" }}>
        <Col span={24}>
          <Table />
        </Col>
      </Row>
    </Col>
  );
}

export default Client;
