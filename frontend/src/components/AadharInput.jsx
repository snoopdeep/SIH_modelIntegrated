import React, { useState } from "react";

const AadharInput = ({ onStart }) => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpButtonClicked, setOtpButtonClicked] = useState(false);

  const handleAadharChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    input = input.substring(0, 12);

    const formattedInput =
      input
        .match(/.{1,4}/g)
        ?.join("-")
        .substring(0, 14) || "";

    setAadharNumber(formattedInput);

    if (input.length === 12) {
      setOtpButtonClicked(false);
    } else {
      setOtpButtonClicked(false);
      setOtpSent(false);
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpButtonClicked(true);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg"></p>
      <p className="mt-4 text-lg">Please enter your Aadhaar number</p>
      <input
        type="text"
        value={aadharNumber}
        onChange={handleAadharChange}
        placeholder="1234-5678-9012"
        maxLength={14}
        className="border rounded-xl p-2 mt-2 text-center font-mono"
      />
      {aadharNumber.length === 14 && !otpSent && (
        <button
          onClick={handleSendOtp}
          className="bg-green-500 text-white py-2 px-4 rounded mt-4 shadow-lg shadow-gray-400"
        >
          Send OTP
        </button>
      )}
      {otpSent && (
        <>
          <p className="mt-4 text-lg">
            Enter the OTP sent to your registered mobile number
          </p>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            maxLength={6}
            className="border rounded p-2 mt-2 text-center"
          />
          <button
            onClick={onStart}
            className="bg-[#3d3d8e] hover:bg-[#4a4ab2] text-white py-2 px-4 rounded mt-4"
            disabled={otp.length !== 6}
          >
            Verify
          </button>
        </>
      )}
    </div>
  );
};

export default AadharInput;
