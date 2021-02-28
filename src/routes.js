import React from "react";
import Loadable from "react-loadable";
import Spinner from "./components/common/Spinner";
import {
  FcHome,
  FcBusinessman,
  FcPlus,
  FcBriefcase,
  FcBusinesswoman,
  FcSupport,
  FcSurvey,
} from "react-icons/fc";

const Loading = () => <Spinner />;

const Dashboard = Loadable({
  loader: () => import("./pages/Dashboard"),
  loading: Loading,
});

const User = Loadable({
  loader: () => import("./pages/User"),
  loading: Loading,
});

const Profile = Loadable({
  loader: () => import("./pages/User/Profile"),
  loading: Loading,
});

const Service = Loadable({
  loader: () => import("./pages/Service"),
  loading: Loading,
});

const Procedure = Loadable({
  loader: () => import("./pages/Procedure"),
  loading: Loading,
});

const Client = Loadable({
  loader: () => import("./pages/Client"),
  loading: Loading,
});

const CadClient = Loadable({
  loader: () => import("./pages/Client/CadClient"),
  loading: Loading,
});

const EditClient = Loadable({
  loader: () => import("./pages/Client/EditClient"),
  loading: Loading,
});

const ClientDetail = Loadable({
  loader: () => import("./pages/Client/ClientDetail"),
  loading: Loading,
});

const Consult = Loadable({
  loader: () => import("./pages/Consult"),
  loading: Loading,
});

const CadConsult = Loadable({
  loader: () => import("./pages/Consult/CadConsult"),
  loading: Loading,
});

const EditConsult = Loadable({
  loader: () => import("./pages/Consult/CadConsult"),
  loading: Loading,
});

const Anamnese = Loadable({
  loader: () => import("./pages/Consult/Anamnese"),
  loading: Loading,
});

const Logs = Loadable({
  loader: () => import("./pages/Logs"),
  loading: Loading,
});

const NotFound = Loadable({
  loader: () => import("./pages/NotFound"),
  loading: Loading,
});

const routes = [
  {
    path: "/home",
    exact: true,
    icon: <FcHome size={22} />,
    name: "Inicio",
    Component: Dashboard,
  },
  {
    path: "/home/usuario",
    icon: <FcBusinessman size={22} />,
    exact: true,
    name: "Usuarios",
    Component: User,
  },
  {
    path: "/home/usuario/:id",
    icon: <FcBusinessman size={22} />,
    name: "Perfil",
    Component: Profile,
  },
  {
    path: "/home/servico",
    icon: <FcSupport size={22} />,
    name: "Serviços",
    Component: Service,
  },
  {
    path: "/home/procedimento",
    icon: <FcSurvey size={22} />,
    name: "Procedimentos",
    Component: Procedure,
  },
  { path: "/home/logs", name: "Logs Sistema", Component: Logs },
  {
    path: "/home/consultas",
    exact: true,
    name: "Consultas",
    icon: <FcBriefcase size={22} />,
    Component: Consult,
  },
  {
    path: "/home/consultas/adicionar",
    name: "Adicionar Consultas",
    icon: <FcPlus size={22} />,
    Component: CadConsult,
  },
  {
    path: "/home/consulta/:id",
    icon: <FcBriefcase size={22} />,
    exact: true,
    name: "Detalhes Consulta",
    Component: Consult,
  },
  {
    path: "/home/consulta/:id/editar",
    icon: <FcBriefcase size={22} />,
    name: "Editar Consultas",
    Component: EditConsult,
  },
  {
    path: "/home/consulta/:id/anamnese",
    name: "Realizar Consulta",
    Component: Anamnese,
  },
  {
    path: "/home/cliente/:id",
    name: "Detalhes Cliente",
    Component: ClientDetail,
  },
  { path: "/home/clientes", exact: true, name: "Clientes", Component: Client },
  {
    path: "/home/clientes/adicionar",
    icon: <FcPlus size={22} />,
    name: "Adicionar Cliente",
    Component: CadClient,
  },
  {
    path: "/home/clientes/:id",
    icon: <FcBusinesswoman size={22} />,
    name: "Editar Cliente",
    Component: EditClient,
  },
  { name: "Pagina não encontrada", Component: NotFound },
];

export default routes;
