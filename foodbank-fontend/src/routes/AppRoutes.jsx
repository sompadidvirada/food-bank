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
import ReportPerBranch from "../scenes/report_per_branch/ReportPerBranch";
import ReportAll from "../scenes/report_all/ReportAll";
import BarSell from "../scenes/Bar/BarSell";
import BarSend from "../scenes/Bar/BarSend";
import BarExp from "../scenes/Bar/BarExp";
import PieSell from "../scenes/Pie/PieSell";
import PieSend from "../scenes/Pie/PieSend";
import PieExp from "../scenes/Pie/PieExp";
import LineMain from "../scenes/Line/LineMain";
import Calendar from "../scenes/calendar/Calendar"
import CalendarAdmin from "../scenes/calendar/CalendarAdmin";
import UploadS3 from "../scenes/upload/UploadS3";

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
      { path: "product", element: <Product /> },
      { path: "tracksell", element: <Tracksell /> },
      { path: "tracksend", element: <Tracksend /> },
      { path: "trackexp", element: <Trackexp /> },
      { path: "reportperbranch", element: <ReportPerBranch /> },
      { path: "reportall", element: <ReportAll /> },
      { path: "barsell", element: <BarSell /> },
      { path: "barsend", element: <BarSend /> },
      { path: "barexp", element: <BarExp /> },
      { path: "piesell", element: <PieSell /> },
      { path: "piesend", element: <PieSend /> },
      { path: "pieexp", element: <PieExp /> },
      { path: "line", element: <LineMain /> },
      { path: "calendaradmin", element: <CalendarAdmin /> },
      { path: "uploadimage", element: <UploadS3 /> },
    ],
  },
  {
    path: "/user",
    element: <ProtectUser element={<LayoutUser />} />,
    children: [
      { index: true, element: <OpenStreetMap /> },
      { path: "product", element: <Product /> },
      { path: "tracksell", element: <Tracksell /> },
      { path: "tracksend", element: <Tracksend /> },
      { path: "trackexp", element: <Trackexp /> },
      { path: "reportperbranch", element: <ReportPerBranch /> },
      { path: "reportall", element: <ReportAll /> },
      { path: "calendar", element: <Calendar /> },
    ],
  },
]);

const AppRoutes = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
};

export default AppRoutes;
