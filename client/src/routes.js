import Dashboard from "views/admin/Dashboard.js";
import Profile from "views/admin/Profile.js";
import AddMinistry from "views/admin/AddMinistry.js";
import Ministry from "views/admin/Ministry";
import AllDepartment from "views/admin/AllDepartment";
import AllUnit from "views/admin/AllUnit";
import Term from "views/admin/Term";
import Report from "views/ministry/Report";
import BudgetRequest from "views/admin/BudgetRequest";

import { FiUser } from "react-icons/fi";
import { RiAddBoxFill, RiDashboardFill } from "react-icons/ri";
import { TiWeatherStormy } from "react-icons/ti";
import {
  BsGraphUp,
  BsFillFileEarmarkCheckFill,
  BsBuilding,
} from "react-icons/bs";
import { RiBuildingFill } from "react-icons/ri";
import { RxComponent2 } from "react-icons/rx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <RiDashboardFill size="24" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/ministry",
    name: "Ministries",
    icon: <RiBuildingFill size="24" />,
    component: Ministry,
    layout: "/admin",
  },
  {
    path: "/alldepartment",
    name: "Departments",
    icon: <BsBuilding size="24" />,
    component: AllDepartment,
    layout: "/admin",
  },
  {
    path: "/allunit",
    name: "Units",
    icon: <RxComponent2 size="24" />,
    component: AllUnit,
    layout: "/admin",
  },

  {
    path: "/terms",
    name: "Terms",
    icon: <TiWeatherStormy size="24" />,
    component: Term,
    layout: "/admin",
  },

  {
    path: "/addministry",
    name: "Add Ministry",
    icon: <RiAddBoxFill size="24" />,
    component: AddMinistry,
    layout: "/admin",
  },
  {
    path: "/report",
    name: "Report",
    icon: <BsGraphUp size="24" />,
    component: Report,
    layout: "/admin",
  },
  {
    path: "/budget_request",
    name: "Budget Request",
    icon: <BsFillFileEarmarkCheckFill size="24" />,
    component: BudgetRequest,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <FiUser size="24" />,
    component: Profile,
    layout: "/admin",
  },
];
export default routes;
