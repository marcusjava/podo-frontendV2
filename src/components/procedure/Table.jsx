import React, { useEffect, useState } from "react";
import { Table, Input, Button, Row, Col, Typography } from "antd";
import Spinner from "../layout/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getProcedures } from "../../redux/actions/procedureActions";
import { SearchOutlined } from "@ant-design/icons";
import Modal from "./Modal";

const { Text } = Typography;

const ProcedureTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.procedure.procedures);

  useEffect(() => {
    dispatch(getProcedures());
  }, []);

  useEffect(() => {
    if (items) {
      setData(
        items.map((procedure) => ({
          key: procedure._id,
          name: procedure.name,
          service: procedure.service,
          description: procedure.description,
          price: procedure.price,
          observations: procedure.observations,
        }))
      );
    }
  }, [items]);

  let searchInput = null;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder="Buscar"
          value={selectedKeys[0]}
          onChange={(e) => {
            return setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Limpar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) setTimeout(() => searchInput.select());
    },
  });

  const columns = [
    {
      key: "service",
      width: 20,
      title: "Serviço",
      dataIndex: "service",
      render: (service) => {
        return <strong>{service.description}</strong>;
      },
    },
    {
      key: "name",
      title: "Nome",
      width: 150,
      dataIndex: "name",

      render: (name) => {
        return <strong>{name}</strong>;
      },
      ...getColumnSearchProps("name"),
    },
    {
      key: "price",
      title: "Valor",
      width: 20,
      dataIndex: "price",

      render: (price) => {
        return <strong>{`R$ ${price}`}</strong>;
      },
    },
    {
      key: "description",
      width: 250,
      title: "Descrição",
      dataIndex: "description",
    },

    {
      title: "Açoes",
      width: 5,
      align: "center",
      render: (record) => <Modal editMode={true} data={record} />,
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <Table
      dataSource={data}
      columns={columns}
      footer={(current) => `Total: ${current.length}`}
    />
  );
};

export default ProcedureTable;