import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const AppLayout = () => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <div style={{ minWidth: 240, maxWidth: 320, width: 280 }}>
      <SideBar />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Outlet />
    </div>
  </div>
);

export default AppLayout;
