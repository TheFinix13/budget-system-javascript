import Dashboard from "views/ministry/Dashboard.js";
import Profile from "views/ministry/Profile.js";
import Budget from "views/ministry/Budget";
import AllDepartment from "views/ministry/Departments";
import AllUnit from "views/ministry/AllUnits";
import Expenditure from "views/ministry/Expenditure";
import Report from "views/ministry/Report";

import { FiUser } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { GoNote } from "react-icons/go";
import { BsGraphUp, BsBuilding } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { RxComponent2 } from "react-icons/rx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <RiDashboardFill size="24" />,
    component: Dashboard,
    layout: "/ministry",
  },

  {
    path: "/alldepartment",
    name: "Departments",
    icon: <BsBuilding size="24" />,
    component: AllDepartment,
    layout: "/ministry",
  },

  {
    path: "/allunit",
    name: "Units",
    icon: <RxComponent2 size="24" />,
    component: AllUnit,
    layout: "/ministry",
  },

  {
    path: "/budget",
    name: "Budgeting",
    icon: <GoNote size="24" />,
    component: Budget,
    layout: "/ministry",
  },

  {
    path: "/expenditure",
    name: "Expenditure",
    icon: <FaWallet size="24" />,
    component: Expenditure,
    layout: "/ministry",
  },

  {
    path: "/report",
    name: "Report",
    icon: <BsGraphUp size="24" />,
    component: Report,
    layout: "/ministry",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <FiUser size="24" />,
    component: Profile,
    layout: "/ministry",
  },
];
export default routes;
