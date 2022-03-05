import React, { memo } from "react";
import { Row, Col, Form, Button } from "antd";

const ToolBar = (props) => {
  let nextDisable = props.nextDisable;
  let nextLoading = props.nextLoading ? true : false;
  return (
    <Row>
      <Col span={24}>
        <div className="steps-action">
          <Form.Item>
            {[1, 4, 5].includes(props.step)
              ? <Button
                type="info"
                size="large"
                style={{ margin: "0 8px" }}
                onClick={props.previous}
              >
                قبلی
              </Button>
              : null
            }
            <Button
              type="primary"
              htmlType="submit"
              disabled={nextDisable}
              loading={nextLoading}
            >
              بعدی
            </Button>
          </Form.Item>
        </div>
      </Col>
    </Row>
  );
};

export default memo(ToolBar);
