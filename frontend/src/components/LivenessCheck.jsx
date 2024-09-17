import React, { useState, useEffect, useRef } from "react";

const LivenessCheck = () => {
  const [buttonLabel, setButtonLabel] = useState("START");
  const [isChecking, setIsChecking] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    handleInitializeModel();
  }, []);

  const handleInitializeModel = async () => {
    try {
      const response = await fetch("http://localhost:5000/initialize_model", {
        method: "GET",
      });

      if (response.ok) {
        setIsModelInitialized(true);
        // setResponseMessage("Model initialized successfully.");
      } else {
        setResponseMessage("Error initializing model.");
      }
    } catch (error) {
      console.error("Error initializing model:", error);
      setResponseMessage("Error initializing model.");
    }
  };

  const startRecording = async () => {
    if (!isModelInitialized) {
      setResponseMessage("Model is not initialized. Please wait.");
      return;
    }

    setIsRecording(true);
    setButtonLabel("RECORDING...");

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    let chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedBlob(blob);
      setIsRecording(false);
      setButtonLabel("SUBMIT");
      videoRef.current.srcObject = null;
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, 10000); // Stop recording after 10 seconds
  };

  const handleVideoUpload = async () => {
    if (!recordedBlob) {
      setResponseMessage("Please record a video first.");
      return;
    }

    setButtonLabel("CHECKING");
    setIsChecking(true);

    const formData = new FormData();
    formData.append("video", recordedBlob, "recorded_video.webm");

    try {
      const response = await fetch("http://localhost:5000/process_video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Liveness check completed.", data);
        setResponseMessage(data.message + "\nOutput: " + data.output);
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error during liveness check: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Error during liveness check.");
    }

    setIsChecking(false);
    setButtonLabel("START");
    setRecordedBlob(null);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="text-2xl font-bold mb-6">Liveness Check</p>
      <p className="text-lg text-gray-600 mb-4">
        {isModelInitialized
          ? "Click 'START' to record a 10-second video."
          : "Initializing model..."}
      </p>
      <video
        ref={videoRef}
        className="mt-4"
        autoPlay
        muted
        style={{ display: isRecording ? "block" : "none" }}
      ></video>
      <button
        className="mt-4 bg-[#007bff] text-white py-3 px-6 rounded-full hover:bg-[#0056b3] transition duration-300 shadow-lg shadow-gray-400"
        onClick={buttonLabel === "START" ? startRecording : handleVideoUpload}
        disabled={isChecking || (buttonLabel === "SUBMIT" && !recordedBlob)}
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
