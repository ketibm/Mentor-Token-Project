import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Welcome/Header";
import Footer from "../components/Welcome/Footer";
const Root = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Root;
