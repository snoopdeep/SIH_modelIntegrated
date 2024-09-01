import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import successAnimation from '../../public/Anim2.json'; 

const SuccessAnimation = ({ isPlaying }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const animationInstance = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: false, 
      autoplay: false,
      animationData: successAnimation,
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

export default SuccessAnimation;
