import React from "react";
import { Steps } from "antd";

const { Step } = Steps;

function StepBar({ step }) {
  return (
    <Steps responsive={false} current={step}>
      <Step key={1} title={""} />
      <Step key={2} title={""} />
      <Step key={3} title={""} />
      <Step key={4} title={""} />
    </Steps>
  );
}

export default StepBar;
