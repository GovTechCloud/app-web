import React from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}