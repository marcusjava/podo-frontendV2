import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

const Breadcrumbs = ({ crumbs, icon }) => {
  return (
    <Breadcrumb>
      {crumbs.map(({ name, path, icon }, key) =>
        key + 1 === crumbs.length ? (
          <Breadcrumb.Item key={key}>
            <span style={{ fontWeight: "bold", fontSize: "18pt" }}>
              {icon} {name}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item
            key={key}
            style={{ fontWeight: "bold", fontSize: "18pt" }}
          >
            <Link to={path}>
              {icon} {name}
            </Link>
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
