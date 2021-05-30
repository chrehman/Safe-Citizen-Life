
import Dashboard from "views/Dashboard.js";
import UsersList from "views/UsersList.js";
import RequestList from "views/RequestList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";

const dashboardRoutes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Registered Users List",
    icon: "nc-icon nc-circle-09",
    component: UsersList,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Registration Request",
    icon: "nc-icon nc-notes",
    component: RequestList,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },
];

export default dashboardRoutes;
