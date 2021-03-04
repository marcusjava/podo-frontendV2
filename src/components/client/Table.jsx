import React, { useEffect, useState } from "react";
import { Table, Popover, Input, Button } from "antd";
import Spinner from "../layout/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getClients } from "../../redux/actions/clientActions";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { MdEdit, MdDescription } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";

const ClientTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.client.clients);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      setData(
        items.map((item) => ({
          key: item._id,
          avatar: item.avatar_url,
          name: item.name,
          cpf: item.cpf,
          contact: item.contact,
          address: item.address,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
        }))
      );
    }
  }, [items]);

  let searchInput = null;

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
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
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
      if (dataIndex === "local") {
        return record[dataIndex].name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) setTimeout(() => searchInput.select());
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img
          src={avatar}
          alt="perfil"
          style={{ width: "50px", height: "50px", borderRadius: "50px" }}
        />
      ),
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
      ...getColumnSearchProps("cpf"),
    },
    {
      title: "Contato",
      dataIndex: "contact",
      key: "contact",
      ...getColumnSearchProps("contact"),
      render: (contact) => <strong>{contact}</strong>,
    },
    {
      title: "Endereço",
      dataIndex: "address",
      render: (address) => {
        const content = (
          <div>
            <p>Rua - {address.street}</p>
            <p>Bairro - {address.neighborhood}</p>
            <p>Cidade - {address.city.label}</p>
            <p>Estado - {address.state.label}</p>
          </div>
        );
        return (
          <Popover content={content}>
            <p>{address.street}</p>
          </Popover>
        );
      },
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Criado por",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => <p>{text.name}</p>,
    },
    {
      title: "Ações",
      render: (record) => (
        <>
          <RouterLink to={`/home/clientes/${record.key}`}>
            <MdEdit size={20} />
          </RouterLink>
          <RouterLink to={`/home/cliente/${record.key}`}>
            <MdDescription size={20} />
          </RouterLink>
        </>
      ),
    },
  ];

  return items.length > 0 || !loading ? (
    <Table
      dataSource={data}
      columns={columns}
      footer={(current) => `Total: ${current.length}`}
    />
  ) : (
    <Spinner />
  );
};

export default ClientTable;
