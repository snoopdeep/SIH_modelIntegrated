import React, { useState } from "react";

const LivenessCheck = () => {
  const [buttonLabel, setButtonLabel] = useState("START");
  const [isChecking, setIsChecking] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleButtonClick = async () => {
    setButtonLabel("CHECKING");
    setIsChecking(true);

    try {
      const response = await fetch("http://localhost:5000/liveness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Liveness check completed.",data);
        setResponseMessage(data.message);
      } else {
        setResponseMessage("Error during liveness check.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Error during liveness check.");
    }

    setIsChecking(false);
    setButtonLabel("START");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="text-2xl font-bold mb-6">Liveness Check</p>
      <button
        className={`mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-300 shadow-lg shadow-gray-400 ${
          isChecking ? "cursor-not-allowed" : ""
        }`}
        onClick={handleButtonClick}
        disabled={isChecking}
      >
        {buttonLabel}
      </button>
      {responseMessage && (
        <p className="mt-4 text-lg text-gray-700">{responseMessage}</p>
      )}
    </div>
  );
};

export default LivenessCheck;
