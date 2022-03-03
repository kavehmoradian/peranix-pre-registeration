import React, { memo, useEffect, useRef, useState } from "react";
import { Progress, Row, Col, Button } from "antd";

//import parse
import Parse from "../../Api/ParseServer";

const sp = require("../../Assets/js/speedtest").default;
const test = new sp();

const InternetSpeedTest = (props) => {
  const handleStep = props.handleStep;
  const currentUser = Parse.User.current();
  const speedTestServer = useRef(null);
  const [dlSpeed, setDlSpeed] = useState(0);
  const [ulSpeed, setUlSpeed] = useState(0);
  const [pingStatus, setPingStatus] = useState(0);
  const [jitterStatus, setJitterStatus] = useState(0);
  const [percent, setPercent] = useState(0);
  const [testStatus, setTestStatus] = useState(-1);

  test.onupdate = (data) => {
    setDlSpeed(
      data.testState === 1 && (data.dlStatus === 0 || data.dlStatus === "")
        ? 0
        : data.dlStatus
    );
    setUlSpeed(
      data.testState === 3 && (data.ulStatus === 0 || data.ulStatus === "")
        ? 0
        : data.ulStatus
    );
    setPingStatus(data.pingStatus === "" ? 0 : data.pingStatus);
    setJitterStatus(data.jitterStatus === "" ? 0 : data.jitterStatus);
    var prog =
      (Number(data.dlProgress) * 2 +
        Number(data.ulProgress) * 2 +
        Number(data.pingProgress)) /
      5;
    setTestStatus(data.testState);
    setPercent(parseInt(100 * prog));
  };
  test.onend = async (aborted) => {
    if (
      dlSpeed !== 0 &&
      ulSpeed !== 0 &&
      jitterStatus !== 0 &&
      pingStatus !== 0
    ) {
      const InternetSpeedtest = Parse.Object.extend("InternetSpeedtest");
      const internetSpeedtest = new InternetSpeedtest();
      internetSpeedtest.set("user", currentUser);
      internetSpeedtest.set("download", String(dlSpeed));
      internetSpeedtest.set("upload", String(ulSpeed));
      internetSpeedtest.set("jitter", String(jitterStatus));
      internetSpeedtest.set("ping", String(pingStatus));
      await internetSpeedtest.save();
      handleStep(+1);
    }
  };
  let startTest = () => {
    test.start();
    setTestStatus(-1);
  };
  useEffect(() => {
    const getServerList = () => {
      if (speedTestServer.current === null)
        Parse.Config.get().then((config) => {
          test.setSelectedServer(config.get("speed_test_serve"));
          speedTestServer.current = config.get("speed_test_serve");
          if (props.autoStart) {
            startTest();
          }
        });
    };
    getServerList();
  }, [props]);
  return (
    <>
      <Row>
        <Col span={24}>
          <Progress
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            percent={percent}
            status="active"
          />
          <Row>
            <Col>
              <p
                style={{
                  marginTop: "20px",
                  lineHeight: "30px",
                  textAlign: "center",
                }}
              >
                برای انتخاب زمان بازی می‌بایست کیفیت اتصال اینترنت شما رو بررسی
                کنیم.
              </p>
            </Col>
          </Row>
          {testStatus === -1 ? null : testStatus === 0 ? (
            <p>- تست در حال انجامه</p>
          ) : testStatus === 1 ? (
            <div>
              <p>- در حال اندازه گیری سرعت دانلود</p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "21px",
                  marginTop: "35px",
                }}
              >
                <span style={{ margin: "5px 14px" }}>
                  سرعت دانلود : {dlSpeed} Mb{" "}
                </span>
              </p>
            </div>
          ) : testStatus === 2 ? (
            <div>
              <p>- در حال اندازه گیری پینگ</p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  marginTop: "35px",
                }}
              >
                <span style={{ margin: "5px 14px" }}>
                  پینگ : {pingStatus} ms{" "}
                </span>
                <span style={{ margin: "5px 14px" }}>
                  جیتر : {jitterStatus} ms
                </span>
              </p>
            </div>
          ) : testStatus === 3 ? (
            <div>
              <p>- در حال اندازه گیری سرعت آپلود</p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "21px",
                  marginTop: "35px",
                }}
              >
                <span style={{ margin: "5px 14px" }}>
                  سرعت آپلود : {ulSpeed} Mb{" "}
                </span>
              </p>
            </div>
          ) : testStatus === 4 ? (
            <div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "21px",
                  marginTop: "35px",
                }}
              >
                <span style={{ margin: "0px 14px" }}>
                  سرعت دانلود : {dlSpeed} Mb{" "}
                </span>
                <br />
                <span style={{ margin: "0px 14px" }}>
                  سرعت آپلود : {ulSpeed} Mb{" "}
                </span>
              </p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  marginTop: "35px",
                }}
              >
                <span style={{ margin: "0px 14px" }}>
                  پینگ : {pingStatus} ms{" "}
                </span>
                |
                <span style={{ margin: "0px 14px" }}>
                  جیتر : {jitterStatus} ms
                </span>
              </p>
            </div>
          ) : (
            <p>- تست با مشکل مواجه شد</p>
          )}
        </Col>
      </Row>
      {[-1, 4, 5].includes(testStatus) ? (
        <Row justify="center">
          <Col span={8} style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size={"large"}
              onClick={startTest}
              style={{ float: "right" }}
            >
              شروع تست
            </Button>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default memo(InternetSpeedTest);
