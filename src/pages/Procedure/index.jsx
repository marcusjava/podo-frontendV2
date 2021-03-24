import React from "react";
import { Row, Col } from "antd";
import Table from "../../components/procedure/Table";
import CadModal from "../../components/procedure/CadModal";

function Procedure() {
  return (
    <div>
      <Row>
        <Col>
          <CadModal />
        </Col>
      </Row>
      <Row style={{ marginTop: "30px" }}>
        <Col lg={20} md={20}>
          <Table />
        </Col>
      </Row>
    </div>
  );
}

export default Procedure;
