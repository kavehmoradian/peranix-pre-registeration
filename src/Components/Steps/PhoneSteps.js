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
      await Parse.Cloud.run("sendOtpCode", { phone, source: "gta-v" });

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
    <>
      <h1>شماره تلفن همراه خود را وارد کنید</h1>
      <p style={{ fontSize: "18px" }}>
        توجه کنید پیش ثبت نام در پرانیکس با تلفن همراه هیچ گونه هزینه ای از شارژ
        سیم کارت شما کسر نمی‌کند.
      </p>
      <p style={{ fontSize: "18px", color: "#ffb703" }}>
        شماره ای که وارد میکنید امکان تغییر نخواهد داشت.
      </p>
      <Row>
        <Col md={24} xs={23}>
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
            <div style={{ marginBottom: 100 }}>
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
    </>
  );
}

export default PhoneStesps;
