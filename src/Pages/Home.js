import React from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import { isMobile } from 'react-device-detect';


import gtaConver from "../Assets/images/gta-v-cover.png";

let items = [
  {
    key: 1,
    title: "بازی بدون نیاز به کامپیوتر گیمینگ یا کنسول قوی",
    content: "بازی روی سرورهای پرانیکس اجرا میشه و هیچ پردازشی روی موبایل یا کامپیوتر شما نیست و با یک سیستم معمولی یا ضعیف هم میتونید بازی کنید.",
  },
  {
    key: 2,
    title: "سریع و همه جا با موبایل، بازی های جدید رو اجرا کن",
    content: "هرجا و هر ساعتی میتونی با موبایل در پرانیکس بازی کنی.",
  },
  {
    key: 3,
    title: "بدون نیاز به دانلود و نصب",
    content: "نگران نباش که موبایل یا کامپیوتر جا نداره و حتی نمیخواد صبر کنی که بازی دانلود و نصب بشه. در کمتر از ۳۰ ثانیه وارد بازی میشی.",
  }
]


function Home() {
  return (
    <>
      <Row justify="center" style={{ marginTop: '40px', marginBottom: '20px' }}>
        {
          isMobile
            ? <>
              <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#ff9e00' }}>تا ظرفیت تموم نشده همین الان ثبت نام کن</h1>
              </Col>
              <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                <Link to="/pre-register/gta-v" className="start-register-btn">
                  پیش ثبت‌نام بازی GTA V
                </Link>
              </Col>
            </>
            : <Col xs={24} md={24} style={{ textAlign: 'center' }}>
              <h1 style={{ color: '#ff9e00', width: 'fit-content', marginLeft: 32, display: "inline" }}>تا ظرفیت تموم نشده همین الان ثبت نام کن</h1>
              <Link to="/pre-register/gta-v" className="start-register-btn">
                پیش ثبت‌نام بازی GTA V
              </Link>
            </Col>
        }
      </Row>
      <Row justify="center">
        <Col xs={24} md={12} style={{ textAlign: 'center',marginBottom:20 }}>
          <img style={{ width: '95%' }} src={gtaConver} alt="gta-cover"/>
        </Col>
        <Col xs={24} md={12}>
          {
            items.map(item => {
              return <Row key={item.key} justify="center" style={{ marginBottom: 35 }}>
                <Col span={24}>
                  <Row justify="left">
                    <Col span={24}>
                      <p className="main-advantage-item-title">
                        {item.title}
                      </p>
                      <p className="main-advantage-item-content">
                        {item.content}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            })
          }
        </Col>
      </Row>
    </>
  );
}

export default Home;
