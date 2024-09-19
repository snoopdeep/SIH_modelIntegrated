


// // ---------------------------------------- //



import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import AuthAnimation from "./AuthAnimation";
import LivenessCheck from "./LivenessCheck";

const FaceCaptureScreen = ({ onComplete }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Align your face within the frame.");
  const [showAnimation, setShowAnimation] = useState(false);
  const [showWebcam, setShowWebcam] = useState(true);
  const [taskIndex, setTaskIndex] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [livenessResult, setLivenessResult] = useState(null);
  const [timer, setTimer] = useState(5);
  const [showLivenessCheck, setShowLivenessCheck] = useState(false);
  const [livenessFailed, setLivenessFailed] = useState(false);

  const availableTasks = [
    "Right:Open", "Right:Close", "Right:Four", "Right:Three", "Right:Pointer",
    "Left:Open", "Left:Close", "Left:Four", "Left:Three", "Left:Pointer"
  ];

  useEffect(() => {
    const selectedTasks = [];
    while (selectedTasks.length < 2) {
      const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
      if (!selectedTasks.includes(randomTask)) {
        selectedTasks.push(randomTask);
      }
    }
    setTasks(selectedTasks);
  }, []);

  useEffect(() => {
    if (cameraReady && tasks.length > 0 && tasksCompleted < 2) {
      setMessage(`Task ${tasksCompleted + 1}: Show ${tasks[taskIndex]}`);
      setShowWebcam(true);
      captureAndVerifyLiveness();
    } else if (tasksCompleted === 2) {
      setMessage("You may now verify your liveness.");
      setShowWebcam(false);
    }
  }, [cameraReady, tasks, taskIndex, tasksCompleted]);

  const captureAndVerifyLiveness = async () => {
    const capturedFrames = [];
    const captureCount = 30;
    const delayBetweenCaptures = 100;

    // Step 1: Show the gesture for 2 seconds
    setMessage(`Task: Show ${tasks[taskIndex]}`);
    setTimer(2); // Display gesture for 2 seconds

    // Start a 2-second countdown to show the gesture
    const gestureTimerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(gestureTimerInterval); // Stop the timer when it reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Wait for 2 seconds before proceeding with liveness capture
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Start the camera and immediately begin capturing frames
    setMessage("Capturing frames for liveness check...");
    setShowWebcam(true); // Display the webcam

    let framesCaptured = 0;
    while (framesCaptured < captureCount) {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        try {
          const response = await fetch(imageSrc);
          const blob = await response.blob();
          capturedFrames.push(blob);
          framesCaptured++;
        } catch (error) {
          console.error("Error capturing frame:", error);
        }
      } else {
        console.warn("getScreenshot returned null, retrying...");
      }
      await new Promise((resolve) => setTimeout(resolve, delayBetweenCaptures));
    }

    // Immediately close the camera after capturing frames
    setShowWebcam(false);

    // Step 3: Send captured frames for liveness verification
    setShowAnimation(true); // Show animation while analyzing

    try {
      setLoading(true);

      // Send the captured frames to the backend for analysis
      const formData = new FormData();
      capturedFrames.forEach((frame, index) => {
        formData.append(`image_${index}`, frame, `frame_${index}.jpg`);
      });

      const result = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();
      console.log(data);
      setLoading(false);
      setShowAnimation(false);

      if (data.movements && Array.isArray(data.movements) && data.movements.length > 0) {
        setLivenessResult(data.movements);

        // Check if any hand_sign in the response matches the current task
        const currentTask = tasks[taskIndex].split(':');
        const taskSide = currentTask[0];
        const taskGesture = currentTask[1];

        if (data.movements.some(movement => 
          movement.hand_side === taskSide && movement.hand_sign.includes(taskGesture)
        )) {
          proceedToNextTask(); // Move to the next task
        } else {
          setLivenessFailed(true); // Liveness failed
        }
      } else {
        console.error("Unexpected response format or empty movements array:", data);
        setMessage("No valid movements detected. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error verifying liveness:", error);
      setLoading(false);
      setMessage("Error verifying liveness. Please try again.");
    }
  };

  const proceedToNextTask = () => {
    setShowWebcam(false);
    setShowAnimation(true);
    setLoading(true);

    const animationTimer = setTimeout(() => {
      setTasksCompleted((prev) => prev + 1);
      setTaskIndex((prev) => prev + 1);
      setShowAnimation(false);
      setLoading(false);
      if (tasksCompleted + 1 < 2) {
        setMessage(`Task ${tasksCompleted + 2}: Show ${tasks[taskIndex + 1]}`);
        setShowWebcam(true);
      } else {
        setMessage("You may now verify your liveness.");
      }
    }, 2000);
  };

  const handleLivenessCheck = () => {
    setShowLivenessCheck(true);
  };

  if (showLivenessCheck) {
    return <LivenessCheck />;
  }

  if (livenessFailed) {
    return (
      <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
        <p className="text-2xl font-semibold text-red-600">
          Your liveness check has failed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3 relative">
      {timer > 0 && (
        <div className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full">
          {timer}
        </div>
      )}
      <p className="bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg"></p>
      {showAnimation ? (
        <>
          <AuthAnimation isPlaying={showAnimation} />
          <p className="mt-4 text-xl font-semibold text-gray-700">Analyzing, please wait...</p>
        </>
      ) : (
        <>
          {showWebcam && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="border-4 border-blue-600 rounded-lg mb-4 mt-4"
              videoConstraints={{
                facingMode: "user",
              }}
              onUserMedia={() => setCameraReady(true)}
            />
          )}
          <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
          {tasksCompleted === 2 && (
            <>
              <button
                className="mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-800 shadow-lg shadow-gray-400"
                onClick={handleLivenessCheck}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Liveness"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FaceCaptureScreen;



