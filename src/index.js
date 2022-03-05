import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ConfigProvider } from "antd";
require("dotenv").config();

ReactDOM.render(
  <ConfigProvider direction="rtl">
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);
