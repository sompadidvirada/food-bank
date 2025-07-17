import { useState } from "react";
import Topbar from "../global/Topbar";
import SideBarUser from '../global/SideBarUser';
import { Outlet } from "react-router-dom";

const LayoutUser = () => {
 const [isSideBar, setIsSideBar] = useState(true);
  return (
    <div className="layout">
      <SideBarUser isSideBar={isSideBar} />
      <main className="content">
        <Topbar setIsSideBar={setIsSideBar} />
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutUser