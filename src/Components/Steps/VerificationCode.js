import React, { useState } from "react";
import { Typography, Form, Statistic, Button, Row, Col } from "antd";
import ToolBar from "../ToolBar/index";
import persianJs from "persianjs";
import OtpInput from "react-otp-input";

//import api parse
import Parse from "../../Api/ParseServer";

const { Title } = Typography;
const { Countdown } = Statistic;

let VerificationCode = ({ phone, handleStep, step }) => {
  const [nextLoading, setNextLoading] = useState(false);
  const [sendSmsAgainBtn, setSendSmsAgainBtn] = useState(true);
  const [otp, setOtp] = useState("");
  const [hasError, setHasError] = useState({});
  const [deadline, setDeadline] = useState(
    new Date(new Date().getTime() + 1000 * 60)
  );
  let handleChange = (otp) => {
    if ("help" in hasError) setHasError({});
    setOtp(otp);
    if (otp.toString().length === 4) {
      validateOtpCode(otp);
    }
  };
  let sendCodeAgian = async () => {
    Parse.Cloud.run("sendOtpCode", {
      phone: phone,
    }).then(
      function (result) {
        if (result === "OK") {
          setDeadline(new Date(new Date().getTime() + 1000 * 60));
          setSendSmsAgainBtn(true);
        }
      },
      (error) => {
        // This will be called.
        // error is an instance of Parse.Error with details about the error.
        if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
          setDeadline(new Date(new Date().getTime() + 1000 * 60));
          setSendSmsAgainBtn(true);
        }
      }
    );
  };

  let validateOtpCode = (otp) => {
    setNextLoading(true);
    let verifayCode = String(persianJs(otp).persianNumber());
    return Parse.User.logIn(phone, verifayCode).then(
      (_user) => {
        // The current user is now set to user.
        onNext();
        // return Promise.resolve();
      },
      function (error) {
        // The token could not be validated.
        setNextLoading(false);
        let msg;
        if (error.code === 101) {
          msg = "کد تایید وارد شده صحیح نمی‌باشد.";
        } else {
          msg = "خطای غیر منتظره رخ داده، لطفا به پشتیبانی پیام دهید.";
        }
        setHasError({
          validateStatus: "error",
          help: msg,
        });
      }
    );
  };

  const onNext = () => {
    handleStep(+1);
  };
  const onPrevious = () => {
    handleStep(-1);
  };
  return (
    <>
      <Title>کد تایید</Title>
      <p style={{ fontSize: "18px" }}>
        کد تایید 4 رقمی برای {"0" + phone} ارسال شده است.لطفا آن را وارد کنید.
      </p>
      <Row>
        <Col md={24} xs={23}>
          <Form>
            <Row>
              <Col xs={24}>
                <div style={{ marginBottom: 16 }}>
                  <Form.Item {...hasError}>
                    <div className="input-form-siunup-otp-code">
                      <OtpInput
                        value={otp}
                        onChange={handleChange}
                        numInputs={4}
                        isInputNum={true}
                        shouldAutoFocus={true}
                        hasErrored={"help" in hasError}
                        errorStyle="input-form-siunup-otp-code-error"
                      />
                    </div>
                  </Form.Item>
                  <Row>
                    <Col xs={10} md={7}>
                      کد را دریافت نکردید؟
                    </Col>
                    <Col xs={7}>
                      <Button
                        disabled={sendSmsAgainBtn}
                        type="text"
                        onClick={sendCodeAgian}
                        style={{
                          height: "unset",
                        }}
                      >
                        {sendSmsAgainBtn ? (
                          <Countdown
                            value={deadline}
                            format="ss"
                            onFinish={() => setSendSmsAgainBtn(false)}
                            suffix="ثانیه تا ارسال مجدد"
                            valueStyle={{
                              fontFamily: "iranyekan",
                              fontSize: "15px",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontFamily: "iranyekan",
                              color: "#15b6fb",
                            }}
                          >
                            ارسال دوباره
                          </span>
                        )}
                      </Button>
                    </Col>
                  </Row>
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                      maxWidth: "250px",
                    }}
                  ></div>
                </div>
              </Col>
            </Row>
            <ToolBar
              step={step}
              next={onNext}
              previous={onPrevious}
              nextDisable={true}
              nextLoading={nextLoading}
            />
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default VerificationCode;
