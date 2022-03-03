import React, { useState, useEffect } from "react";
import StepBar from "../Components/StepBar/StepBar";
import PhoneStesps from "../Components/Steps/PhoneSteps";
import LastStep from "../Components/Steps/LastStep";
import VerificationCode from "../Components/Steps/VerificationCode";
import SpeedTest from "../Components/SpeedTest/main";
import Parse from "../Api/ParseServer";

function Register() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState();
  const handlePhone = (newPhone) => {
    setPhone(newPhone);
  };
  const handleStep = (ad) => {
    setStep((prev) => prev + ad);
  };
  useEffect(() => {
    if (Parse.User.current() === undefined) {
      setStep(0);
    } else {
      const query = new Parse.Query("InternetSpeedtest");
      query.equalTo("user", Parse.User.current());
      query.find().then((result) => {
        if (result.length > 0) {
          setStep(3);
        } else {
          setStep(2);
        }
      });
    }
  }, []);
  return (
    <>
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <StepBar step={step} />
      </div>
      {step === 0 && (
        <PhoneStesps
          handlePhone={handlePhone}
          handleStep={handleStep}
          step={step}
        />
      )}
      {step === 1 && (
        <VerificationCode phone={phone} handleStep={handleStep} step={step} />
      )}
      {step === 2 && <SpeedTest handleStep={handleStep} step={step} />}
      {step === 3 && <LastStep />}
    </>
  );
}

export default Register;
