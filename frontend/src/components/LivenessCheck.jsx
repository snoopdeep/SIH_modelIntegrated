import React, { useState, useEffect, useRef } from "react";
import SuccessfulLiveness from "./SuccessfulLiveness";
import FakeLiveness from "./FakeLiveness";

const LivenessCheck = () => {
  const [buttonLabel, setButtonLabel] = useState("START");
  const [isChecking, setIsChecking] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [livenessResult, setLivenessResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
        setResponseMessage(""); // Model initialized successfully.
      } else {
        setResponseMessage("Error initializing model. Please try again.");
      }
    } catch (error) {
      console.error("Error initializing model:", error);
      setResponseMessage("Network error: Unable to initialize model.");
    }
  };

  const startRecording = async () => {
    if (!isModelInitialized) {
      setResponseMessage("Model is not initialized. Please wait.");
      return;
    }

    setIsRecording(true);
    setButtonLabel("RECORDING...");
    setResponseMessage("Recording in progress...");

    try {
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
        setResponseMessage("Recording completed. Please submit the video.");
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 10000); // Stop recording after 10 seconds
    } catch (error) {
      console.error("Error starting video recording:", error);
      setIsRecording(false);
      setResponseMessage(
        "Error accessing camera. Please check your permissions."
      );
    }
  };

  const handleVideoUpload = async () => {
    if (!recordedBlob) {
      setResponseMessage("Please record a video first.");
      return;
    }

    setButtonLabel("CHECKING...");
    setIsChecking(true);
    setIsProcessing(true);
    setResponseMessage("Checking the video for liveness...");

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

        // Check if the output contains any "Real" classification
        if (data.output && data.output.toLowerCase().includes("real")) {
          setLivenessResult("success");
          setResponseMessage("Liveness check passed successfully.");
        } else if (data.output && data.output.toLowerCase().includes("fake")) {
          setLivenessResult("fake");
          setResponseMessage("Liveness check failed. Fake detected.");
        } else {
          setResponseMessage(
            "Unexpected response from the server. Please try again."
          );
        }
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error during liveness check: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error during video upload:", error);
      setResponseMessage(
        "Network error: Unable to upload video for liveness check."
      );
    }

    setIsChecking(false);
    setButtonLabel("START");
    setRecordedBlob(null);
    setIsProcessing(false);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
        <p className="text-2xl font-bold mb-6">Processing</p>
        <p className="text-lg text-gray-600 mb-4">
          Please wait while we process your video...
        </p>
      </div>
    );
  }

  if (livenessResult === "success") {
    return <SuccessfulLiveness />;
  }

  if (livenessResult === "fake") {
    return <FakeLiveness />;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="text-2xl font-bold mb-6">Liveness Check</p>

      <p className="text-lg text-gray-600 mb-4">
        {isModelInitialized && buttonLabel === "START"
          ? "Click 'START' to record a short video. Please follow the on-screen instructions carefully for the next step."
          : ""}
      </p>

      {isRecording && (
        <video ref={videoRef} className="mt-4 w-full max-w-md" autoPlay muted />
      )}

      <button
        className={`mt-4 py-3 px-6 rounded-full transition duration-300 shadow-lg ${
          isChecking || (buttonLabel === "SUBMIT" && !recordedBlob)
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#007bff] text-white hover:bg-[#0056b3]"
        }`}
        onClick={buttonLabel === "START" ? startRecording : handleVideoUpload}
        disabled={isChecking || (buttonLabel === "SUBMIT" && !recordedBlob)}
      >
        {buttonLabel}
      </button>

      {responseMessage && (
        <p className="mt-4 text-lg text-gray-700">{responseMessage}</p>
      )}

      {isChecking && (
        <p className="mt-4 text-md text-gray-500">
          The liveness check may take a few seconds. Please be patient...
        </p>
      )}
    </div>
  );
};

export default LivenessCheck;
