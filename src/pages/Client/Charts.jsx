import React, { useState } from "react";
import { Row, Col, Card, DatePicker, Button, Select, Space } from "antd";
import Chart from "../../components/Chart";
import dayjs from "dayjs";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";

// import { Container } from './styles';
const { RangePicker } = DatePicker;
const { Option } = Select;

function Charts() {
  const [selectedDate, setSelectedDate] = useState([]);
  const [data, setData] = useState([]);

  let searchInput = null;

  const onSearch = async () => {
    const params = {
      startDate: dayjs(selectedDate[0]).format("YYYY-MM-DD"),
      endDate: dayjs(selectedDate[1]).format("YYYY-MM-DD"),
    };

    const response = await axios.get("/clients/stats/clients", {
      params,
    });
    setData(response.data);
  };

  return (
    <Col span={16}>
      <Card bordered={false}>
        <Row style={{ marginTop: 50 }}>
          <Col span={16}>
            <Space>
              <RangePicker
                ref={(node) => {
                  searchInput = node;
                }}
                value={selectedDate}
                format="DD/MM/YYYY"
                onChange={(dates) => setSelectedDate(dates)}
              />

              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
              >
                Pesquisar
              </Button>
            </Space>
          </Col>
        </Row>
        <Row style={{ marginTop: 150 }}>
          <Col span={16}>
            <Chart data={data} />
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export default Charts;
