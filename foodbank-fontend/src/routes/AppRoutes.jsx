import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../scenes/authen/Login";
import ProtectAdmin from "./ProtectAdmin";
import ProtectUser from "./ProtectUser";
import LaoyoutAdmin from "../scenes/layout/LaoyoutAdmin";
import Dashboard from "../scenes/Dashboard/Dashboard";
import Team from "../scenes/Team/Team";
import LayoutUser from "../scenes/layout/LayoutUser";
import OpenStreetMap from "../scenes/Map/OpenStreetMap";
import Product from "../scenes/Product/Product";
import Tracksell from "../scenes/Tracking/Tracksell";
import Tracksend from "../scenes/Tracking/Tracksend";
import Trackexp from "../scenes/Tracking/Trackexp";

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
      { path: "team", element: <Team /> },
      { path: "map", element: <OpenStreetMap /> },
      { path: "product", element: <Product/> },
      { path: "tracksell", element: <Tracksell/> },
      { path: "tracksend", element: <Tracksend/> },
      { path: "trackexp", element: <Trackexp/> },
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
  return (
    <RouterProvider
    router={router}
    future={{
      v7_startTransition:true,
      v7_relativeSplatPath: true,
    }}
    />
  )
};

export default AppRoutes;
