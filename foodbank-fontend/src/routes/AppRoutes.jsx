import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../scenes/authen/Login";
import ProtectAdmin from "./ProtectAdmin";
import ProtectUser from "./ProtectUser";
import LaoyoutAdmin from "../scenes/layout/LaoyoutAdmin";
import Dashboard from "../scenes/Dashboard/Dashboard";
import Team from "../scenes/Team/Team";
import LayoutUser from "../scenes/layout/LayoutUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <ProtectAdmin element={<LaoyoutAdmin />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { index: "team", element: <Team /> },
    ],
  },
  {
    path: "/user",
    element: <ProtectUser element={<LayoutUser />} />,
    children: [
        { index: true, element: <Dashboard />}
    ]
  }
]);

const AppRoutes = () => {
  return <div>AppRoutes</div>;
};

export default AppRoutes;
