import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from "antd";
import { Helmet } from "react-helmet";
require("dotenv").config();

ReactDOM.render(
  <ConfigProvider direction="rtl">
    <Helmet>
      <title>پرانیکس</title>
    </Helmet>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);