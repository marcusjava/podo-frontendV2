import React, { useEffect, useState } from "react";
import { Badge, Card, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";

// import { Container } from './styles';

/*
 *
 * 3 Pnels com as seguintes informações:
 * Realizadas, Remarcadas,Canceladas,  novos clientes(filtar pela data de inclusao))
 *
 *
 */

const gridStyle = {
  width: "25%",
  textAlign: "center",
};

function StatsByMonth() {
  const [clients, setClients] = useState([]);
  const [consults, setConsults] = useState([]);
  const [stats, setStats] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [consultsLoading, setConsultsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const query = {
    start: dayjs().startOf("month").format("YYYY-MM-DD"),
    end: dayjs().endOf("month").format("YYYY-MM-DD"),
  };

  useEffect(() => {
    async function getClients() {
      const clientsData = await axios.get("/clients", { params: query });
      setClients(clientsData.data);
      setClientsLoading(false);
    }

    async function getStats() {
      const statsData = await axios.get("/consults/stats/consults");
    }

    async function getConsults() {
      const consultsData = await axios.get("/consults", { params: query });
      setConsults(consultsData.data);
      setConsultsLoading(false);
    }

    getClients();
    getConsults();
    getStats();
  }, []);
  return (
    <Card>
      <Card.Grid style={gridStyle}>
        Consultas Agendadas mês{" "}
        {consultsLoading ? (
          <Spin size="small" />
        ) : (
          <Badge
            showZero
            count={consults.filter((item) => item.status === "Marcada").length}
            style={{ backgroundColor: "#eeb64d", fontSize: 18 }}
          />
        )}
      </Card.Grid>
      <Card.Grid style={gridStyle}>
        Consultas Realizadas mês{" "}
        {consultsLoading ? (
          <Spin size="small" />
        ) : (
          <Badge
            showZero
            count={
              consults.filter((item) => item.status === "Realizada").length
            }
            style={{ backgroundColor: "#52c41a", fontSize: 18 }}
          />
        )}
      </Card.Grid>
      <Card.Grid style={gridStyle}>
        Consultas Canceladas mês{" "}
        {consultsLoading ? (
          <Spin size="small" />
        ) : (
          <Badge
            showZero
            count={
              consults.filter((item) => item.status === "Cancelada").length
            }
            style={{ fontSize: 18 }}
          />
        )}
      </Card.Grid>
      <Card.Grid style={gridStyle}>
        Novos Clientes mês{" "}
        {clientsLoading ? (
          <Spin size="small" />
        ) : (
          <Badge
            showZero
            count={clients.length}
            style={{ backgroundColor: "#89b8ee", fontSize: 18 }}
          />
        )}
      </Card.Grid>
    </Card>
  );
}

export default StatsByMonth;
