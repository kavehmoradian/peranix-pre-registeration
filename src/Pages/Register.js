import React, {useState} from "react";
import StepBar from "../Components/StepBar/StepBar"

function Register() {
    const [step, setStep] = useState(0);
    return (
        <div>
            <StepBar step={step}/>
        </div>
    )
}

export default Register;