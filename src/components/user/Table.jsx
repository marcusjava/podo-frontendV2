import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Button, Typography } from "antd";
import Spinner from "../layout/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/actions/userActions";
import { red, green } from "@ant-design/colors";
import { SearchOutlined } from "@ant-design/icons";
import Modal from "./Modal";

const statusColors = {
  Ativo: green[6],
  Inativo: red[2],
};

const { Text } = Typography;

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.auth.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (items) {
      setData(
        items.map((user) => ({
          key: user._id,
          avatar_url: user.avatar_url,
          name: user.name,
          cpf: user.cpf,
          rg: user.rg,
          nasc: user.nasc,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          status: user.status,
        }))
      );
    }
  }, [items]);

  let searchInput = null;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log(selectedKeys[0], dataIndex);
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
      console.log(record, value);

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
      key: "avatar_url",
      title: "Foto",
      dataIndex: "avatar_url",
      render: (avatar_url) => (
        <img
          src={avatar_url}
          alt="perfil"
          style={{ width: "50px", height: "50px", borderRadius: "50px" }}
        />
      ),
    },
    {
      key: "name",
      title: "Nome",
      dataIndex: "name",
      render: (name) => {
        return <strong>{name}</strong>;
      },
      ...getColumnSearchProps("name"),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",

      ...getColumnSearchProps("email"),
    },
    {
      key: "phone",
      title: "Contato",
      dataIndex: "phone",
    },
    {
      title: "Endereço",
      dataIndex: "address",
      key: "address",
      render: (address) => {
        return address ? (
          <Text>
            {address.street},{address.city} - {address.state}
          </Text>
        ) : null;
      },
    },
    {
      key: "role",
      title: "Nivel",
      dataIndex: "role",
      filters: [
        { text: "Usuario", value: "Usuario" },
        { text: "Administrador", value: "Administrador" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (role) => (
        <Tag color={role === "Usuario" ? "#2db7f5" : "#f50"}>{role}</Tag>
      ),
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
    {
      title: "Açoes",
      render: (record) => <Modal editMode={true} data={record} />,
    },
  ];

  return !loading ? <Table dataSource={data} columns={columns} /> : <Spinner />;
};

export default UsersTable;
