import React, { useEffect, useState } from "react";
import {
  Table,
  Popover,
  Tag,
  Input,
  Button,
  Avatar,
  DatePicker,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getConsults, updateConsult } from "../../redux/actions/consultActions";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { MdEdit } from "react-icons/md";
import { FcCancel, FcBriefcase, FcPrint } from "react-icons/fc";
import moment from "moment";

const { RangePicker } = DatePicker;

const statusColors = {
  Marcada: "processing",
  Realizada: "green",
  Cancelada: "red",
  Remarcada: "magenta",
};

const ConsultTable = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState([]);
  const [searchColumn, setSearchColumn] = useState("");
  const [toggle, setToggle] = useState(true);

  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.consult.consults);

  const list = () => {
    dispatch(getConsults());
  };

  useEffect(() => {
    if (items) {
      setData(
        items.map((consult) => ({
          key: consult._id,
          date: consult.date,
          client: consult.client,
          procedures: consult.procedures,
          price: consult.price,
          type_consult: consult.type_consult,
          status: consult.status,
        }))
      );
    }
  }, [items]);

  let searchInput = null;

  useEffect(() => {
    list();
  }, []);

  const handleDateSearch = () => {
    const start = selectedDate[0].format("YYYY-MM-DD");
    const end = selectedDate[1].format("YYYY-MM-DD");
    dispatch(getConsults({ start, end }));
  };

  const handleDateClear = () => {
    setSelectedDate([]);
    dispatch(getConsults());
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const onCancel = (consult) => {
    const data = {
      _id: consult.key,
      date: consult.date,
      client: consult.client._id,
      procedures: consult.procedures.map((item) => item._id),
      status: "Cancelada",
      type_consult: consult.type_consult,
    };

    const confirm = window.confirm("Deseja realmente cancelar a consulta?");

    if (confirm === true) {
      dispatch(updateConsult(data));
    } else {
      return;
    }
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
      if (dataIndex === "client") {
        return record[dataIndex].name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      if (dataIndex === "procedures") {
        return record[dataIndex].find((item) => {
          return item.name
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        });
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

  const columns = [
    {
      key: "date",
      title: "Data/Hora",
      dataIndex: "date",
      render: (date) => (
        <strong>
          <h3>{moment(date).format("DD/MM/YYYY HH:mm")}</h3>
        </strong>
      ),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      filterDropdown: () => (
        <div style={{ padding: 8, display: "flex", flexDirection: "column" }}>
          <RangePicker
            ref={(node) => {
              searchInput = node;
            }}
            value={selectedDate}
            format="DD/MM/YYYY"
            onChange={(dates) => setSelectedDate(dates)}
            style={{ marginBottom: 8 }}
            size="small"
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              disabled={selectedDate.length < 2}
              onClick={() => handleDateSearch()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => handleDateClear()}
              size="small"
              style={{ width: 90 }}
            >
              Limpar
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      key: "client",
      title: "Cliente",
      dataIndex: "client",
      render: (client) => {
        const content = (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Avatar
              src={client.avatar_url}
              style={{ width: "125px", height: "125px", alignSelf: "center" }}
            />
            <p>Nome - {client.name}</p>
            <p>Email - {client.email}</p>
            <p>
              Contato - {client.contact1} - {client.contact2}
            </p>
          </div>
        );
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "5px",
            }}
          >
            <Popover title="Dados cliente" content={content}>
              <Avatar
                src={client.avatar_url}
                style={{ width: "50px", height: "50px", marginRight: 5 }}
              />
              {client.name}
            </Popover>
          </div>
        );
      },
      ...getColumnSearchProps("client"),
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
      ...getColumnSearchProps("procedures"),
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
    {
      title: "Açoes",
      render: (record) => {
        return (
          <div>
            <Tooltip title="Cancelar Consulta">
              <Button
                disabled={record.status === "Cancelada"}
                style={{
                  border: "none",
                  fontSize: 18,
                  backgroundColor: "transparent",
                  margin: 5,
                  padding: 0,
                }}
                onClick={() => onCancel(record)}
              >
                <FcCancel size={24} />
              </Button>
            </Tooltip>
            <Tooltip title="Editar Consulta">
              <Link to={`/home/consulta/${record.key}/editar`}>
                <Button
                  style={{
                    border: "none",
                    fontSize: 25,
                    backgroundColor: "transparent",
                    margin: 5,
                    padding: 0,
                  }}
                >
                  <MdEdit size={24} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Realizar Consulta">
              <Link to={`/home/consulta/${record.key}/anamnese`}>
                <Button
                  style={{
                    border: "none",
                    fontSize: 25,
                    backgroundColor: "transparent",
                    margin: 5,
                    padding: 0,
                  }}
                >
                  <FcBriefcase size={24} />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Imprimir Ficha">
              <Link to={`/ficha/${record.key}`}>
                <Button
                  disabled={record.status !== "Realizada"}
                  style={{
                    border: "none",
                    fontSize: 25,
                    backgroundColor: "transparent",
                    margin: 5,
                    padding: 0,
                  }}
                >
                  <FcPrint size={24} />
                </Button>
              </Link>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={loading}
      footer={(current) => `Total: ${current.length}`}
    />
  );
};

export default ConsultTable;
