import React from "react";
import { Layout } from "antd";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../Assets/images/logo-and-type-white.png";
const { Header } = Layout;

function Head() {
  return (
    <Header
      style={{ position: "fixed", zIndex: 2, width: "100%" }}
      className="header"
    >
      <div
        style={{
          float: "right",
          width: "160px",
          marginLeft: "14px",
          margin: "-5px 0px 0 12px",
        }}
      >
        <Link to="/">
          <img src={Logo} alt="logo" style={{ width: "100%" }} />
        </Link>
      </div>
      <div className="secounder-mobile-menu">
        <NavLink
          activeClassName="menu-item-selected"
          className="menu-item-prnx menu-item-selected"
          exact
          to="/"
        >
          صفحه اصلی
        </NavLink>
      </div>
    </Header>
  );
}

export default Head;
