import React from "react";
import ConsultTable from "../../components/consult/Table";
import { Row, Col, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { FcBusinesswoman, FcBriefcase } from "react-icons/fc";
import StatsByMonth from "../../components/statistics/StatsByMonth";
import SearchClient from "../../components/client/SearchClient";

// import { Container } from './styles';

function Dashboard() {
  return (
    <Col md={24}>
      <Row justify="end" gutter={[0, 32]} style={{ marginBottom: "30px" }}>
        <Col span={8} justify="end">
          <SearchClient />
        </Col>
      </Row>
      <Row justify="space-between" align="middle">
        <Col flex={2}>
          <Space>
            <Link to="/home/consultas/adicionar">
              <Button
                type="primary"
                icon={<FcBriefcase size={20} />}
                size="large"
              >
                Nova Consulta
              </Button>
            </Link>
            <Link to="/home/clientes/adicionar">
              <Button
                type="primary"
                icon={<FcBusinesswoman size={20} />}
                size="large"
              >
                Novo Cliente
              </Button>
            </Link>
          </Space>
        </Col>
        <Col flex={3}>
          <StatsByMonth />
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: "30px" }}>
        <Col md={24}>
          <ConsultTable />
        </Col>
      </Row>
    </Col>
  );
}

export default Dashboard;
