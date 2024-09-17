// import React, { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import AuthAnimation from "./AuthAnimation"; // Import your animation component
// import LivenessCheck from "./LivenessCheck"; // Import the new component

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
//   const [timer, setTimer] = useState(5); // Timer state for capturing frames
//   const [showLivenessCheck, setShowLivenessCheck] = useState(false); // New state to show LivenessCheck component
//   const [livenessFailed, setLivenessFailed] = useState(false); // State to show if liveness check failed

//   const availableTasks = ["left", "right", "up", "down"];

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
//       captureAndVerifyLiveness(); // Start capturing frames during the task
//     } else if (tasksCompleted === 2) {
//       setMessage("You may now verify your liveness.");
//       setShowWebcam(false); // Hide the webcam
//     }
//   }, [cameraReady, tasks, taskIndex, tasksCompleted]);

//   const captureAndVerifyLiveness = async () => {
//     const capturedFrames = [];
//     const captureCount = 30; // Ensure exactly 30 frames are captured
//     const delayBetweenCaptures = 100; // Delay between captures in milliseconds

//     setMessage(`${tasks[taskIndex]}`);
//     setTimer(5); // Reset timer to 5 seconds for capturing

//     // Countdown Timer for capturing frames
//     const timerInterval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerInterval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     // Capture frames
//     let framesCaptured = 0; // Track the number of frames captured
//     while (framesCaptured < captureCount) {
//       const imageSrc = webcamRef.current?.getScreenshot(); // Capture image from webcam
//       if (imageSrc) {
//         try {
//           const response = await fetch(imageSrc);
//           const blob = await response.blob();
//           capturedFrames.push(blob); // Add frame to capturedFrames array
//           framesCaptured++; // Increment the count of successfully captured frames
//         } catch (error) {
//           console.error("Error capturing frame:", error);
//         }
//       } else {
//         console.warn("getScreenshot returned null, retrying...");
//       }
//       await new Promise((resolve) => setTimeout(resolve, delayBetweenCaptures)); // Wait for the specified delay
//     }

//     console.log({ movement: capturedFrames }); // Log frames count to check consistency

//     // Hide the webcam and show animation while analyzing
//     setShowWebcam(false);
//     setShowAnimation(true);

//     // Send captured frames to backend for liveness detection
//     try {
//       setLoading(true);

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
//       setLoading(false);
//       setShowAnimation(false); // Hide the animation after receiving response

//       // Ensure the liveness result is an array and not undefined or empty
//       if (data.movements && Array.isArray(data.movements) && data.movements.length > 0) {
//         setLivenessResult(data.movements); // Set result to state

//         // Correct condition: Check if the current task is included in the response
//         if (data.movements.some((movement) => movement.toLowerCase() === tasks[taskIndex])) {
//           proceedToNextTask(); // Proceed to next task
//         } else {
//           setLivenessFailed(true); // Show liveness failed component
//         }
//       } else {
//         // Handle empty or unexpected response structure
//         console.error("Unexpected response format or empty movements array:", data);
//         setMessage("No valid movements detected. Please try again.");
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error verifying liveness:", error);
//       setLoading(false);
//       setMessage("Error verifying liveness. Please try again.");
//     }
//   };

//   const proceedToNextTask = () => {
//     setShowWebcam(false);
//     setShowAnimation(true);
//     setLoading(true);

//     const animationTimer = setTimeout(() => {
//       setTasksCompleted((prev) => prev + 1);
//       setTaskIndex((prev) => prev + 1);
//       setShowAnimation(false);
//       setLoading(false);
//       setMessage(`Task ${tasksCompleted + 1}: ${tasks[taskIndex]}`);
//       setShowWebcam(true); // Show webcam again for the next task
//     }, 2000);
//   };

//   const handleLivenessCheck = () => {
//     // Just navigate to the LivenessCheck component without sending a request
//     setShowLivenessCheck(true); // Show the LivenessCheck component
//   };

//   if (showLivenessCheck) {
//     return <LivenessCheck />; // Render LivenessCheck component if state is true
//   }

//   if (livenessFailed) {
//     return (
//       <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
//         <p className="text-2xl font-semibold text-red-600">
//           Your liveness check has failed.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3 relative">
//       {/* Timer Display in the Corner */}
//       {timer > 0 && (
//         <div className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full">
//           {timer}
//         </div>
//       )}
//       <p className="bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg"></p>
//       {showAnimation ? (
//         <>
//           <AuthAnimation isPlaying={showAnimation} />
//           <p className="mt-4 text-xl font-semibold text-gray-700">Analyzing, please wait...</p>
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
//             <>
//               <button
//                 className="mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-800 shadow-lg shadow-gray-400"
//                 onClick={handleLivenessCheck} // Go to LivenessCheck component
//                 disabled={loading}
//               >
//                 {loading ? "Verifying..." : "Verify Liveness"}
//               </button>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default FaceCaptureScreen;



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

    setMessage(`Show ${tasks[taskIndex]}`);
    setTimer(5);

    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

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

    setShowWebcam(false);
    setShowAnimation(true);

    try {
      setLoading(true);

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
          proceedToNextTask();
        } else {
          setLivenessFailed(true);
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
