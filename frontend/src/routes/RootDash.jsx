import React from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "../components/Dashboard/Dashboard";
import "./RootDash.css";

const RootDash = ({ userRole }) => {
  return (
    <div className="dash">
      <Dashboard role={userRole} />
      <div className="dash--content">
        <Outlet />
      </div>
    </div>
  );
};

export default RootDash;
