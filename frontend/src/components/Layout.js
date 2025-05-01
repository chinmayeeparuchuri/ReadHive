import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px" }}> {/* Adjust based on navbar height */}
        {children}
      </div>
    </>
  );
};

export default Layout;
