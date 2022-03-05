import React, { useState } from "react";
import { Input, Form, Row, Col } from "antd";
import ToolBar from "../ToolBar/index";
import persianJs from "persianjs";

//import api
import Parse from "../../Api/ParseServer";

function PhoneStesps({ handlePhone, handleStep, step }) {
  const [nextDisable, setnextDisable] = useState(true);
  const [phoneValidLen, setPhoneValidLen] = useState(11);
  const [inputError, setInputError] = useState({});
  let onNext = async (values) => {
    let phone = String(persianJs(values.phone).persianNumber());
    if (
      (phone[0] === "0" && phone.length === 11) ||
      (phone[0] !== "0" && phone.length === 10)
    ) {
      if (phone[0] === "0") {
        phone = phone.slice(1, phone.length);
      }
      await Parse.Cloud.run("sendOtpCode", { phone, source: "gta-v-instagram-1400/12/13" });

      handlePhone(phone);
      handleStep(+1);
    } else {
      let phoneLen = phone[0] === "0" ? 11 : 10;
      setInputError({
        validateStatus: "error",
        help: `طول شماره تلفن همراه باید ${phoneLen} عدد باشد`,
      });
    }
  };
  let onPrevious = () => {
    handleStep(-1);
  };
  let phoneChangeHandler = (e) => {
    if ("validateStatus" in inputError) setInputError({});
    if (["0", "۰", "٠"].includes(e.target.value) && phoneValidLen !== 11)
      setPhoneValidLen(11);
    else if (["9", "۹", "٩"].includes(e.target.value) && phoneValidLen !== 10)
      setPhoneValidLen(10);
  };
  return (
    <Row justify="center">
      <Col xs={24} md={18} style={{ paddingRight: '5px' }}>
        <h1 style={{ color: '#ff9e00' }}>تا ظرفیت بازی GTA V تموم نشده سریع ثبت نام کن!</h1>
        <p style={{ fontSize: "18px", margin: '30px 0px 50px 0px' }}>
          توجه کنید ثبت نام در پرانیکس هیچ هزینه ای از شارژ سیم کارت شما کم نمیکند و رایگان است.
        </p>
        <Row>
          <Col md={24} xs={23} style={{ textAlign: 'center' }}>
            <Form
              name="basic"
              onFinish={onNext}
              onFieldsChange={(_, allFields) => {
                if (allFields[0].errors.length === 0 && nextDisable) {
                  setnextDisable(false);
                } else if (allFields[0].errors.length !== 0 && !nextDisable) {
                  setnextDisable(true);
                  return;
                }
              }}
            >
              <div style={{ marginBottom: 60 }}>
                <Form.Item
                  name="phone"
                  {...inputError}
                  rules={[
                    {
                      required: true,
                      message: "لطفا تلفن همراه خود را وارد کنید.",
                    },
                    {
                      pattern: /([\u06F0-\u06F9]|[0-9]|[\u0660-\u0669])+$/,
                      message: "فقط از اعداد فارسی یا انگلیسی استفاده کنید",
                    },
                    {
                      pattern: /^([\u06F0]|[0]|[\u0660])?([\u06F9]|[9]|[\u0669])/,
                      message: "تلفن همراه وارد شده صحیح نیست",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    addonAfter="98+"
                    placeholder="910-111-1111"
                    className="input-form-siunup input-form-siunup-phone-number"
                    onChange={phoneChangeHandler}
                    type="tel"
                    maxLength={phoneValidLen}
                    style={{ direction: "rtl", textAlign: "left" }}
                  />
                </Form.Item>
              </div>
              <ToolBar
                step={step}
                next={onNext}
                previous={onPrevious}
                nextDisable={nextDisable}
              />
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default PhoneStesps;
