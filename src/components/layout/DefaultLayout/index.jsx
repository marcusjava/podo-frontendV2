import React from "react";
import { Layout, Row, Col } from "antd";
import { Switch, Redirect, Route } from "react-router-dom";
import SideBar from "./SideBar";
import routes from "../../../routes";
import Breadcrumbs from "../Breadcrumbs";
import { useSelector } from "react-redux";
import PrivateRoute from "../../PrivateRoute";

const { Content, Footer } = Layout;

const DefaultLayout = () => {
  const { authenticated } = useSelector((state) => state.auth.user);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar />
      <Layout className="site-layout">
        <Switch>
          {routes.map(({ Component, exact, path, icon, name, role }, key) => (
            <Route
              exact={exact}
              path={path}
              key={key}
              render={(props) => {
                const crumbs = routes
                  // Get all routes that contain the current one.
                  .filter(({ path }) => props.match.path.includes(path))
                  // Swap out any dynamic routes with their param values.
                  // E.g. "/pizza/:pizzaId" will become "/pizza/1"
                  .map(({ path, ...rest }) => ({
                    path: Object.keys(props.match.params).length
                      ? Object.keys(props.match.params).reduce(
                          (path, param) =>
                            path.replace(
                              `:${param}`,
                              props.match.params[param]
                            ),
                          path
                        )
                      : path,
                    ...rest,
                  }));

                return (
                  <Content style={{ margin: "10px 16px 0 16px" }}>
                    <Breadcrumbs crumbs={crumbs} />
                    <Col
                      className="site-layout-background"
                      style={{ padding: 24, marginTop: 60 }}
                      span={24}
                    >
                      <PrivateRoute
                        exact={exact}
                        key={key}
                        component={Component}
                        path={path}
                        name={name}
                      />
                    </Col>
                  </Content>
                );
              }}
            />
          ))}
        </Switch>
        <Footer style={{ textAlign: "center" }}>
          Podo ©2020 Created by Marcus Vinicius
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
