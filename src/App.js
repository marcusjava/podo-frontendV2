import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
} from "react-router-dom";
import Login from "./pages/Login";
import { setCurrentUser, logout } from "./redux/actions/userActions";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";
import jwtDecode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import DefaultLayout from "./components/layout/DefaultLayout";
import PagePrint from "./pages/Consult/PagePrint";
import { message as m } from "antd";

if (localStorage.getItem("token")) {
  const token = localStorage.getItem("token");
  setAuthToken(token);
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logout());
    window.location.href = "/";
  }
  store.dispatch(setCurrentUser(decoded));
}

axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API_URL
    : process.env.REACT_APP_API_URL;

//axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    if (!config.url.endsWith("/login")) {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logout());
        window.location.href = "/";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { path, message } = error.response.data;
    const { status } = error.response;
    if (status === 401 || message === "401 unauthorized") {
      m.error("Sessão expirada faça login novamente");
      store.dispatch(logout());
      window.location.href = "/";
    }

    if (path === "general" && status === 500) {
      m.error(message);
    }

    return Promise.reject(error);
  }
);

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/home" component={DefaultLayout} />
            <Route path="/ficha/:id" component={PagePrint} />
          </Switch>
        </div>
      </HashRouter>
    </Provider>
  );
}

export default App;
