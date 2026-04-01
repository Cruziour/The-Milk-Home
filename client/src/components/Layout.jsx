import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const Layout = () => {
  const auth = useSelector(state => state.auth.user);
  const location = useLocation();
  const showNavbar = auth && location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;
