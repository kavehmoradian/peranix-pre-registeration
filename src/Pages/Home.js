import React from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <Row justify="center">
        <Col>
          <Link to="/register">
            <h1>پیش ثبت‌نام بازی gta v</h1>
          </Link>
        </Col>
      </Row>
    </>
  );
}

export default Home;
