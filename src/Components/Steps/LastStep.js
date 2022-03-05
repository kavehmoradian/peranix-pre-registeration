import React from "react";
import { Row, Col } from "antd";

function LastStep() {
  return (
    <Row justify="center">
      <Col xs={24} md={18} style={{ paddingRight: '5px' }}>
        <h1 style={{ color: '#359d58' }}>پیش ثبت نام با موفقیت انجام شد.</h1>
        <p style={{ margin: '20px 0px 0px 0px' }}>
          مرسی که تا این مرحله اومدین و ثبت نام کردید.<br />
          به دلیل محدودیت در ظرفیت سرور های پرانیکس، تا چند روز آینده، دسترسی اکانت شما برای GTA V  فعال میشه و بهتون از طریق پیامک اطلاع میدیم.
        </p>
      </Col>
    </Row>
  );
}

export default LastStep;
