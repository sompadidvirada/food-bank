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
import Calendar from "../scenes/calendar/Calendar";
import CalendarAdmin from "../scenes/calendar/CalendarAdmin";
import UploadS3 from "../scenes/upload/UploadS3";
import OrderManage from "../scenes/order/OrderManage";
import CustomerOrder from "../scenes/customerOrder/CustomerOrder";
import OrderUser from "../scenes/orderUser/OrderUser";
import ManageRawMaterial from "../scenes/rawMaterial/ManageRawMaterial";
import StockRequisition from "../scenes/stockRequisition/StockRequisition";
import ReportStockReqiosition from "../scenes/reportStockRequisition/ReportStockReqiosition";
import CoffeeMenu from "../scenes/coffeeMenu/CoffeeMenu";
import CoffeeSell from "../scenes/insertSellCoffee/CoffeeSell";
import ReportTreekoffUse from "../scenes/reportTreekoffUse/ReportTreekoffUse";
import ProtectBaristar from "./ProtectBaristar";
import LayourBaristar from "../scenes/layout/LayourBaristar";
import BaristarProfile from "../scenes/baristar/BaristarProfile";
import BaristarImage from "../scenes/baristar/BaristarImage";
import OrderBakeryBaristar from "../scenes/baristar/OrderBakeryBaristar";
import TrackUploadImage from "../scenes/trackUploadImage/TrackUploadImage";
import BaristarComment from "../scenes/baristar/BaristarComment";
import HistoryReport from "../scenes/baristar/component/HistoryReport";
import TrackReport from "../scenes/track_report/TrackReport";
import ReportCoffee from "../scenes/report_coffee/ReportCoffee";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/customerorder",
    element: <CustomerOrder />,
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
      { path: "order", element: <OrderManage /> },
      { path: "allorder", element: <OrderUser /> },
      { path: "rawmaterial", element: <ManageRawMaterial /> },
      { path: "insertstockrequisition", element: <StockRequisition /> },
      { path: "stockrequisitionreport", element: <ReportStockReqiosition /> },
      { path: "coffeemenu", element: <CoffeeMenu /> },
      { path: "insertcoffeesell", element: <CoffeeSell /> },
      { path: "reporttreekoffuse", element: <ReportTreekoffUse /> },
      { path: "trackimageallbranch", element: <TrackUploadImage /> },
      { path: "trackreport", element: <TrackReport /> },
      { path: "reportcoffee", element: <ReportCoffee /> },
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
      { path: "allorder", element: <OrderUser /> },
      { path: "rawmaterial", element: <ManageRawMaterial /> },
      { path: "insertstockrequisition", element: <StockRequisition /> },
      { path: "stockrequisitionreport", element: <ReportStockReqiosition /> },
      { path: "coffeemenu", element: <CoffeeMenu /> },
      { path: "team", element: <Team /> },
      { path: "trackimageallbranch", element: <TrackUploadImage /> },
      { path: "trackreport", element: <TrackReport /> },
      { path: "reportcoffee", element: <ReportCoffee /> },
      { path: "insertcoffeesell", element: <CoffeeSell /> },
    ],
  },
  {
  path: "/baristar",
  element: <ProtectBaristar element={<LayourBaristar />} />,
  children: [
    { index: true, element: <BaristarProfile /> },
    { path: "profile", element: <BaristarProfile /> },
    { path: "image", element: <BaristarImage /> },
    { path: "order", element: <OrderBakeryBaristar /> },
    { path: "comment", element: <BaristarComment /> },
    { path: "hisoryreport", element: <HistoryReport /> },
  ],
}
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
