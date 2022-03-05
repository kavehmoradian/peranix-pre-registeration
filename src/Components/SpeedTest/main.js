import React from "react";
import { Row, Col } from "antd";

import InternetSpeedTest from "./InternetSpeedTest";

const SpeedTest = ({ handleStep }) => {
  return (
    <Row justify="center">
      <Col xs={24} md={17} style={{ paddingRight: '5px' }}>
        <h1 style={{ color: '#ff9e00' }}>لطفا صبر کنید و صفحه را نبندید!</h1>
        <p style={{ fontSize: "18px", margin: '30px 0px 50px 0px' }}>
          در حال اندازه گیری سرعت اینترنت و پینگ شما هستیم و لطفا چند لحظه صبر کنید تا ثبت نام شما تکمیل شود
        </p>
        <InternetSpeedTest handleStep={handleStep} autoStart={true} />
      </Col>
    </Row>
  );
};

export default SpeedTest;
