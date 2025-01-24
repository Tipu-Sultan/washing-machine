import React, { useRef, useState } from "react";
import OtpButton from "./OtpButton";

const OTP = () => {
const [otp,setOtp] = useState(new Array(6).fill(""));
const otpRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if(isNaN(value)){
        alert("Please enter only numbers.");
        return false;
    }

    let updateOtp = [...otp];
    updateOtp[index] = value;
    setOtp(updateOtp);

    if (value && index < otp.length - 1) {
        otpRef.current[index + 1].focus();
      }
  }

  const handleKeyDown = (e, index) => {
    if(e.key==='Backspace' || e.key==='Delete'){
        if(index>0 && !otp[index]){
          otpRef.current[index-1].focus();
        }
    }
  }

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData.getData("text"); // Get the clipboard text
    if (clipboardData && !isNaN(clipboardData)) {
      const values = clipboardData.split("").slice(0, otp.length); // Split and limit to OTP length
      const updatedOtp = [...otp];
      values.forEach((char, idx) => {
        updatedOtp[idx] = char;
      });
      setOtp(updatedOtp);
  
      // Focus the next empty input
      const nextIndex = values.length < otp.length ? values.length : otp.length - 1;
      otpRef.current[nextIndex].focus();
    }else{
        alert("Please enter only numbers.");
    }
  };

  const submitOtp = () => {
    if(otp.length<0 && !isNaN(otp)){
        alert("Please enter a valid OTP value.");
        return false;
    }
    alert('Verified successfully');
  }
  
  return (
    <div onPaste={(e)=>handlePaste(e)}>
        <h3>Please enter OTP</h3>
      {otp.map((_, index) => (
        <input 
        key={index}
        type="text" 
        maxLength="1" 
        value={otp[index]}
        onChange={(e)=>handleChange(e,index)}
        onKeyDown={(e)=>handleKeyDown(e,index)}
        autoFocus={index===0}
        ref={(n)=>otpRef.current[index]=n}
        style={{width:"50px",height:"50px",fontSize:"30px",textAlign:"center",margin:"10px"}}
        />
      ))}
      <OtpButton submitOtp={submitOtp}/>
    </div>
  );
};

export default OTP;
