// import React, { useState } from "react";

// const LivenessCheck = () => {
//   const [buttonLabel, setButtonLabel] = useState("START");
//   const [isChecking, setIsChecking] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");

//   const handleButtonClick = async () => {
//     setButtonLabel("CHECKING");
//     setIsChecking(true);
  
//     try {
//       const response = await fetch("http://localhost:5000/livenesscheck", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response);
  
//       if (response.ok) {
//         const data = await response.json();
//         console.log("Liveness check completed.", data);
//         setResponseMessage(data.message + "\nOutput: " + data.output);
//       } else {
//         setResponseMessage("Error during liveness check.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setResponseMessage("Error during liveness check.");
//     }
  
//     setIsChecking(false);
//     setButtonLabel("START");
//   };
  

//   return (
//     <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
//       <p className="text-2xl font-bold mb-6">Liveness Check</p>
//        {/* Added text description */}
//        <p className="text-lg text-gray-600 mb-4">
//         Click the button below to start the liveness check. This process will verify if the system is active and responsive.
//       </p>
//       <button
//         className={`mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-300 shadow-lg shadow-gray-400 ${
//           isChecking ? "cursor-not-allowed" : ""
//         }`}
//         onClick={handleButtonClick}
//         disabled={isChecking}
//       >
//         {buttonLabel}
//       </button>
//       {responseMessage && (
//         <p className="mt-4 text-lg text-gray-700">{responseMessage}</p>
//       )}
//     </div>
//   );
// };

// export default LivenessCheck;

// import React, { useState } from "react";

// const LivenessCheck = () => {
//   const [buttonLabel, setButtonLabel] = useState("START");
//   const [isChecking, setIsChecking] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");

//   const handleInitializeModel = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/initialize_model", {
//         method: "GET",
//       });

//       if (response.ok) {
//         setResponseMessage("Model initialized successfully.");
//       } else {
//         setResponseMessage("Error initializing model.");
//       }
//     } catch (error) {
//       console.error("Error initializing model:", error);
//       setResponseMessage("Error initializing model.");
//     }
//   };

//   const handleVideoUpload = async (event) => {
//     const videoFile = event.target.files[0];
//     if (!videoFile) return;
//     console.log("Selected video file:", videoFile); 

//     setButtonLabel("CHECKING");
//     setIsChecking(true);

//     const formData = new FormData();
//     formData.append("video", videoFile);

//     try {
//       const response = await fetch("http://localhost:5000/process_video", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Liveness check completed.", data);
//         setResponseMessage(data.message + "\nOutput: " + data.output);
//       } else {
//         setResponseMessage("Error during liveness check.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setResponseMessage("Error during liveness check.");
//     }

//     setIsChecking(false);
//     setButtonLabel("START");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
//       <p className="text-2xl font-bold mb-6">Liveness Check</p>
//       <p className="text-lg text-gray-600 mb-4">
//         Click the button below to initialize the model. Once initialized, upload a 10-second video to start the liveness check.
//       </p>
//       <button
//         className="mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-300 shadow-lg shadow-gray-400"
//         onClick={handleInitializeModel}
//         disabled={isChecking}
//       >
//         Initialize Model
//       </button>
//       <input
//         type="file"
//         accept="video/*"
//         className="mt-4"
//         onChange={handleVideoUpload}
//         disabled={isChecking}
//       />
//       {responseMessage && (
//         <p className="mt-4 text-lg text-gray-700">{responseMessage}</p>
//       )}
//     </div>
//   );
// };

// export default LivenessCheck;



// import React, { useState } from "react";

// const LivenessCheck = () => {
//   const [buttonLabel, setButtonLabel] = useState("START");
//   const [isChecking, setIsChecking] = useState(false);
//   const [responseMessage, setResponseMessage] = useState("");
//   const [videoFile, setVideoFile] = useState(null); // New state for managing selected video file

//   const handleInitializeModel = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/initialize_model", {
//         method: "GET",
//       });

//       if (response.ok) {
//         setResponseMessage("Model initialized successfully.");
//       } else {
//         setResponseMessage("Error initializing model.");
//       }
//     } catch (error) {
//       console.error("Error initializing model:", error);
//       setResponseMessage("Error initializing model.");
//     }
//   };

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setVideoFile(selectedFile); // Set the selected file to the state
//       console.log("Selected video file:", selectedFile); // Log the selected file
//     }
//   };

//   const handleVideoUpload = async () => {
//     if (!videoFile) {
//       setResponseMessage("Please select a video file first.");
//       return;
//     }

//     setButtonLabel("CHECKING");
//     setIsChecking(true);

//     const formData = new FormData();
//     formData.append("video", videoFile);

//     try {
//       const response = await fetch("http://localhost:5000/process_video", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Liveness check completed.", data);
//         setResponseMessage(data.message + "\nOutput: " + data.output);
//       } else {
//         const errorData = await response.json();  // Get error message from response
//         setResponseMessage(`Error during liveness check: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setResponseMessage("Error during liveness check.");
//     }

//     setIsChecking(false);
//     setButtonLabel("START");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
//       <p className="text-2xl font-bold mb-6">Liveness Check</p>
//       <p className="text-lg text-gray-600 mb-4">
//         Click the button below to initialize the model. Once initialized, upload a 10-second video to start the liveness check.
//       </p>
//       <button
//         className="mt-4 bg-[#ff8c00] text-white py-3 px-6 rounded-full hover:bg-[#db851c] transition duration-300 shadow-lg shadow-gray-400"
//         onClick={handleInitializeModel}
//         disabled={isChecking}
//       >
//         Initialize Model
//       </button>
//       <input
//         type="file"
//         accept="video/*"
//         className="mt-4"
//         onChange={handleFileChange} // Call handleFileChange on file selection
//         disabled={isChecking}
//       />
//       <button
//         className="mt-4 bg-[#007bff] text-white py-3 px-6 rounded-full hover:bg-[#0056b3] transition duration-300 shadow-lg shadow-gray-400"
//         onClick={handleVideoUpload} // Trigger video upload on click
//         disabled={isChecking || !videoFile} // Disable button if already checking or no file selected
//       >
//         Upload Video
//       </button>
//       {responseMessage && (
//         <p className="mt-4 text-lg text-gray-700">{responseMessage}</p>
//       )}
//     </div>
//   );
// };

// export default LivenessCheck;

import React, { useState, useEffect } from "react";

const LivenessCheck = () => {
  const [buttonLabel, setButtonLabel] = useState("START");
  const [isChecking, setIsChecking] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isModelInitialized, setIsModelInitialized] = useState(false);

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
        setResponseMessage("Model initialized successfully.");
      } else {
        setResponseMessage("Error initializing model.");
      }
    } catch (error) {
      console.error("Error initializing model:", error);
      setResponseMessage("Error initializing model.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setVideoFile(selectedFile);
      console.log("Selected video file:", selectedFile);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      setResponseMessage("Please select a video file first.");
      return;
    }

    if (!isModelInitialized) {
      setResponseMessage("Model is not initialized. Please wait.");
      return;
    }

    setButtonLabel("CHECKING");
    setIsChecking(true);

    const formData = new FormData();
    formData.append("video", videoFile);

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
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="text-2xl font-bold mb-6">Liveness Check</p>
      <p className="text-lg text-gray-600 mb-4">
        {isModelInitialized
          ? "Model is initialized. Upload a 10-second video to start the liveness check."
          : "Initializing model..."}
      </p>
      <input
        type="file"
        accept="video/*"
        className="mt-4"
        onChange={handleFileChange}
        disabled={isChecking || !isModelInitialized}
      />
      <button
        className="mt-4 bg-[#007bff] text-white py-3 px-6 rounded-full hover:bg-[#0056b3] transition duration-300 shadow-lg shadow-gray-400"
        onClick={handleVideoUpload}
        disabled={isChecking || !videoFile || !isModelInitialized}
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