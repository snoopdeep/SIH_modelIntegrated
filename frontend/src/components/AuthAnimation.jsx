import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../../public/Anim1.json";

const AuthAnimation = ({ isPlaying }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animationInstance = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animationData,
    });

    if (isPlaying) {
      animationInstance.goToAndPlay(0, true);
    } else {
      animationInstance.stop();
    }

    return () => animationInstance.destroy();
  }, [isPlaying]);

  return <div ref={animationContainer} style={{ width: 500, height: 500 }} />;
};

export default AuthAnimation;
