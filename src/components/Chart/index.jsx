import React from "react";
import { Column } from "@ant-design/charts";

// import { Container } from './styles';

function Chart({ data }) {
  const config = {
    data,
    width: 800,
    height: 400,
    autoFit: true,
    xField: "_id",
    yField: "count",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };
  return <Column {...config} />;
}

export default Chart;
