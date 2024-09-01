// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import AuthAnimation from "./AuthAnimation"; // Import your animation component

// const FaceCaptureScreen = ({ onComplete }) => {
//   const webcamRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("Align your face within the frame.");
//   const [showAnimation, setShowAnimation] = useState(false);
//   const [showWebcam, setShowWebcam] = useState(true);
//   const [taskIndex, setTaskIndex] = useState(0);
//   const [tasksCompleted, setTasksCompleted] = useState(0);
//   const [tasks, setTasks] = useState([]);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [livenessResult, setLivenessResult] = useState(null); // State to store result

//   const availableTasks = [
//     "Turn Left",
//     "Turn Right",
//     "Look Up",
//     "Look Down",
//     "Blink",
//     "Close Eyes",
//     "Nod Head",
//   ];

//   useEffect(() => {
//     const selectedTasks = [];
//     while (selectedTasks.length < 2) {
//       const randomTask =
//         availableTasks[Math.floor(Math.random() * availableTasks.length)];
//       if (!selectedTasks.includes(randomTask)) {
//         selectedTasks.push(randomTask);
//       }
//     }
//     setTasks(selectedTasks);
//   }, []);

//   useEffect(() => {
//     if (cameraReady && tasks.length > 0 && tasksCompleted < 2) {
//       setMessage(`Task ${tasksCompleted + 1}: ${tasks[taskIndex]}`);
//       setShowWebcam(true);

//       const taskTimer = setTimeout(() => {
//         setShowWebcam(false);
//         setShowAnimation(true);
//         setLoading(true);

//         const animationTimer = setTimeout(() => {
//           setTasksCompleted((prev) => prev + 1);
//           setTaskIndex((prev) => prev + 1);
//           setShowAnimation(false);
//           setLoading(false);
//           setMessage(`Task ${tasksCompleted + 1}: ${tasks[taskIndex]}`);
//           setShowWebcam(true); // Show webcam again for the next task
//         }, 2000);

//         return () => clearTimeout(animationTimer);
//       }, 5000); // Show the task for 5 seconds

//       return () => clearTimeout(taskTimer);
//     } else if (tasksCompleted === 2) {
//       setMessage("You may now verify your liveness.");
//     }
//   }, [cameraReady, tasks, taskIndex, tasksCompleted]);

//   // Modified function to capture multiple frames
//   const captureMultipleFrames = async () => {
//     const capturedFrames = [];
//     const captureCount = 30; // Number of frames to capture
//     const delayBetweenCaptures = 100; // Delay between captures in milliseconds

//     for (let i = 0; i < captureCount; i++) {
//       const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam
//       if (imageSrc) {
//         const response = await fetch(imageSrc);
//         const blob = await response.blob();
//         capturedFrames.push(blob); // Add frame to capturedFrames array
//       }
//       await new Promise((resolve) => setTimeout(resolve, delayBetweenCaptures)); // Wait for the specified delay
//     }

//     // Send captured frames to backend for liveness detection
//     try {
//       setLoading(true);
//       setMessage("Analyzing liveness...");

//       const formData = new FormData();
//       capturedFrames.forEach((frame, index) => {
//         formData.append(`image_${index}`, frame, `frame_${index}.jpg`);
//       });

//       const result = await fetch("http://localhost:5000/detect", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await result.json();
//       console.log(data);
//       setLivenessResult(data.liveness); // Set result to state
//       setLoading(false);
//       setMessage(`Liveness detected: ${data.liveness}`);
//     } catch (error) {
//       console.error("Error verifying liveness:", error);
//       setLoading(false);
//       setMessage("Error verifying liveness. Please try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
//       <p className="bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg"></p>
//       {showAnimation ? (
//         <>
//           <AuthAnimation isPlaying={showAnimation} />
//           <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
//         </>
//       ) : (
//         <>
//           {showWebcam && (
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               screenshotFormat="image/jpeg"
//               className="border-4 border-blue-600 rounded-lg mb-4 mt-4"
//               videoConstraints={{
//                 facingMode: "user",
//               }}
//               onUserMedia={() => setCameraReady(true)} // Camera is ready
//             />
//           )}
//           <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
//           {tasksCompleted === 2 && (
//             <button
//               className="mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-800 shadow-lg shadow-gray-400"
//               onClick={captureMultipleFrames} // Capture multiple images and send to backend
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify Liveness"}
//             </button>
//           )}
//           {livenessResult && (
//             <p className="mt-4 text-2xl font-semibold text-green-600">
//               Liveness Result: {livenessResult}
//             </p>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default FaceCaptureScreen;


import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import AuthAnimation from "./AuthAnimation"; // Import your animation component

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
  const [livenessResult, setLivenessResult] = useState(null); // State to store result
  const [timer, setTimer] = useState(5); // Timer state for capturing frames

  const availableTasks = [
    "Turn Left",
    "Turn Right",
    "Look Up",
    "Look Down",
    "Blink",
    "Close Eyes",
    "Nod Head",
  ];

  useEffect(() => {
    const selectedTasks = [];
    while (selectedTasks.length < 2) {
      const randomTask =
        availableTasks[Math.floor(Math.random() * availableTasks.length)];
      if (!selectedTasks.includes(randomTask)) {
        selectedTasks.push(randomTask);
      }
    }
    setTasks(selectedTasks);
  }, []);

  useEffect(() => {
    if (cameraReady && tasks.length > 0 && tasksCompleted < 2) {
      setMessage(`Task ${tasksCompleted + 1}: ${tasks[taskIndex]}`);
      setShowWebcam(true);

      const taskTimer = setTimeout(() => {
        setShowWebcam(false);
        setShowAnimation(true);
        setLoading(true);

        const animationTimer = setTimeout(() => {
          setTasksCompleted((prev) => prev + 1);
          setTaskIndex((prev) => prev + 1);
          setShowAnimation(false);
          setLoading(false);
          setMessage(`Task ${tasksCompleted + 1}: ${tasks[taskIndex]}`);
          setShowWebcam(true); // Show webcam again for the next task
        }, 2000);

        return () => clearTimeout(animationTimer);
      }, 5000); // Show the task for 5 seconds

      return () => clearTimeout(taskTimer);
    } else if (tasksCompleted === 2) {
      setMessage("You may now verify your liveness.");
    }
  }, [cameraReady, tasks, taskIndex, tasksCompleted]);

  const captureMultipleFrames = async () => {
    const capturedFrames = [];
    const captureCount = 30; // Number of frames to capture
    const delayBetweenCaptures = 100; // Delay between captures in milliseconds

    setMessage("Move your head or blink while frames are being captured.");
    setTimer(5); // Reset timer to 5 seconds for capturing

    // Countdown Timer for capturing frames
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Capture frames
    for (let i = 0; i < captureCount; i++) {
      const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam
      if (imageSrc) {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        capturedFrames.push(blob); // Add frame to capturedFrames array
      }
      await new Promise((resolve) => setTimeout(resolve, delayBetweenCaptures)); // Wait for the specified delay
    }

    // Send captured frames to backend for liveness detection
    try {
      setLoading(true);
      setMessage("Analyzing liveness...");

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
      setLivenessResult(data.liveness); // Set result to state
      setLoading(false);
      setMessage(`Liveness detected: ${data.liveness}`);
    } catch (error) {
      console.error("Error verifying liveness:", error);
      setLoading(false);
      setMessage("Error verifying liveness. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg"></p>
      {showAnimation ? (
        <>
          <AuthAnimation isPlaying={showAnimation} />
          <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
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
              onUserMedia={() => setCameraReady(true)} // Camera is ready
            />
          )}
          <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
          {tasksCompleted === 2 && (
            <>
              <button
                className="mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-800 shadow-lg shadow-gray-400"
                onClick={captureMultipleFrames} // Capture multiple images and send to backend
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Liveness"}
              </button>
              {/* Display Timer */}
              {timer > 0 && (
                <p className="mt-2 text-lg font-semibold text-red-600">
                  Capturing in: {timer} seconds
                </p>
              )}
            </>
          )}
          {livenessResult && (
            <p className="mt-4 text-2xl font-semibold text-green-600">
              Liveness Result: {livenessResult}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FaceCaptureScreen;
