// src/App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import FaceCaptureScreen from "./components/FaceCaptureScreen";
import ResultScreen from "./components/ResultScreen";
import Navbar from "./components/Navbar";
import AadharInput from "./components/AadharInput";
import "./index.css";

function App() {
  const [step, setStep] = useState(1);
  const [authSuccess, setAuthSuccess] = useState(false);

  const onStart = () => setStep(2);
  const next = () => setStep(3);
  const handleComplete = (success) => {
    setAuthSuccess(success);
    setStep(4);
  };
  const handleRetry = () => setStep(1);

  return (
    <div>
      <Header />
      <Navbar />
      {step === 1 && <AadharInput onStart={onStart} />}
      {step === 2 && <HomeScreen next={next} />}
      {step === 3 && <FaceCaptureScreen onComplete={handleComplete} />}
      {step === 4 && (
        <ResultScreen success={authSuccess} onRetry={handleRetry} />
      )}
    </div>
  );
}

export default App;
