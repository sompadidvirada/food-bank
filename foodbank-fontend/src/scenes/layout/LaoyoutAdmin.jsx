import { useState } from "react";
import SideBarAdmin from "../global/SideBarAdmin";
import Topbar from "../global/Topbar";
import { Outlet } from "react-router-dom";

const LaoyoutAdmin = () => {
  const [isSideBar, setIsSideBar] = useState(true);
  return (
    <div className="layout">
      <SideBarAdmin isSideBar={isSideBar} />
      <main className="content">
        <Topbar setIsSideBar={setIsSideBar} />
        <Outlet />
      </main>
    </div>
  );
};

export default LaoyoutAdmin;
