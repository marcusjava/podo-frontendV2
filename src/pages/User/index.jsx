import React from "react";
import { Row, Col } from "antd";
import Table from "../../components/user/Table";
import Modal from "../../components/user/Modal";

const User = () => {
  return (
    <Col md={24}>
      <Row>
        <Col span={24}>
          <Modal />
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "30px" }}>
        <Col span={24}>
          <Table />
        </Col>
      </Row>
    </Col>
  );
};

export default User;
