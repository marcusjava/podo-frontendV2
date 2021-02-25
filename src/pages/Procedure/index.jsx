import React from "react";
import { Row, Col } from "antd";
import Table from "../../components/procedure/Table";
import Modal from "../../components/procedure/Modal";
// import { Container } from './styles';

function Procedure() {
  return (
    <div className="users">
      <Row>
        <Col>
          <Modal />
        </Col>
      </Row>
      <Row style={{ marginTop: "30px" }}>
        <Col>
          <Table />
        </Col>
      </Row>
    </div>
  );
}

export default Procedure;
