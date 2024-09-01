import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import errorAnimation from "../../public/Anim3.json";

const ErrorAnimation = ({ isPlaying }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animationInstance = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: false, // Set to true if you want the animation to loop
      autoplay: false,
      animationData: errorAnimation,
    });

    if (isPlaying) {
      animationInstance.goToAndPlay(0, true);
    } else {
      animationInstance.stop();
    }

    return () => animationInstance.destroy();
  }, [isPlaying]);

  return <div ref={animationContainer} style={{ width: 200, height: 200 }} />;
};

export default ErrorAnimation;
