import React from "react";
import { Row, Col } from "antd";

import InternetSpeedTest from "./InternetSpeedTest";

const SpeedTest = ({ handleStep }) => {
  return (
    <Row justify="center">
      <Col span={15}>
        <InternetSpeedTest handleStep={handleStep} />
      </Col>
    </Row>
  );
};

export default SpeedTest;
