import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Divider, Table, Card, Avatar, Tag, Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "../../redux/actions/clientActions";
import { getConsults } from "../../redux/actions/consultActions";
import dayjs from "dayjs";
import Spinner from "../../components/layout/Spinner";
import { SearchOutlined } from "@ant-design/icons";

const pageStyle = {
  minHeight: "29.7cm",
  padding: "1cm",
  margin: "1cm auto",
  border: "1px #d3d3d3 solid",
  borderRadius: "5px",
  background: "white",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
};

const statusColors = {
  Marcada: "processing",
  Realizada: "green",
  Cancelada: "red",
  Remarcada: "magenta",
};

const ClientDetail = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const { item, loading } = useSelector((state) => state.client.client);

  const { items } = useSelector((state) => state.consult.consults);

  useEffect(() => {
    dispatch(getClient(id));
    dispatch(getConsults({ client_id: id }));
  }, []);

  const columns = [
    {
      key: "date",
      title: "Data/Hora",
      dataIndex: "date",
      render: (date) => (
        <strong>
          <h3>{dayjs(date).format("DD/MM/YYYY HH:mm")}</h3>
        </strong>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },

    {
      key: "procedures",
      title: "Procedimentos",
      dataIndex: "procedures",
      render: (procedures) => {
        return procedures.map((procedure) => {
          const content = (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
              }}
            >
              <p>
                Nome - {procedure.name} - R$ {procedure.price}
              </p>
            </div>
          );
          return (
            <div
              key={procedure._id}
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "5px",
                flexWrap: "wrap",
              }}
            >
              <Popover title="Dados tecnicos" content={content}>
                {procedure.name} - R$ {procedure.price}
              </Popover>
            </div>
          );
        });
      },
    },
    {
      key: "price",
      title: "Total",
      dataIndex: "price",
      render: (price) => <strong>R$ {price}</strong>,
    },
    {
      key: "type_consult",
      title: "Tipo",
      dataIndex: "type_consult",
      render: (type_consult) => <strong>{type_consult}</strong>,
    },

    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Marcada", value: "Marcada" },
        { text: "Realizada", value: "Realizada" },
        { text: "Remarcada", value: "Remarcada" },
        { text: "Cancelada", value: "Cancelada" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
  ];

  return (
    <>
      {loading && Object.keys(item).length > 0 ? (
        <Spinner />
      ) : (
        <Col md={16}>
          <Card style={pageStyle}>
            <Row justify="center">
              <Col md={4}>
                <Avatar src={item.avatar_url} size={250} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Divider orientation="left">Dados Cliente</Divider>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p>
                  <strong>Nome</strong> - {item.name}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>CPF</strong> - {item.cpf}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Contato</strong> - {item.contact}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Email</strong> - {item.email}
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p>
                  <strong>Instagram</strong> - {item.instagram}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Nasc.</strong> -{" "}
                  {dayjs(item.nasc).format("DD/MM/YYYY")}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>RG</strong> - {item.rg}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Ocupação</strong> - {item.occupation}
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p>
                  <strong>Sexo</strong> - {item.sex}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Divider orientation="left">Dados Endereço</Divider>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p>
                  <strong>Rua</strong> - {item.address && item.address.street}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Bairro</strong> -{" "}
                  {item.address && item.address.neighborhood}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Cidade</strong> - {item.address && item.address.city}
                </p>
              </Col>
              <Col span={6}>
                <p>
                  <strong>Estado</strong> - {item.address && item.address.state}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Divider orientation="left">Consultas</Divider>
              </Col>
              <Col md={24}>
                <Table
                  dataSource={items}
                  columns={columns}
                  footer={(current) => `Total: ${current.length}`}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      )}
    </>
  );
};

export default ClientDetail;
