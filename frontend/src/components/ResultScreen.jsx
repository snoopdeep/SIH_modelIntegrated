import React from 'react';
import SuccessAnimation from './SuccessAnimation';
import ErrorAnimation from './ErrorAnimation'; 

const ResultScreen = ({ success, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl text-center mt-2">
      <p className="bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg mb-4"></p>
      {success ? (
        <>
          <SuccessAnimation isPlaying={true} /> 
          <h2 className="text-3xl font-bold text-green-600 mt-8 mb-4">Face Authentication Successful!</h2>
          <p className="text-lg text-gray-600">You are now authenticated.</p>
        </>
      ) : (
        <>
          <ErrorAnimation isPlaying={true} />
          <h2 className="text-3xl font-bold text-red-600 mt-8 mb-4">Face Authentication Failed</h2>
          <p className="text-lg text-gray-600">Please try again.</p>
          <button
            className="mt-4 bg-yellow-600 text-white py-3 px-6 rounded-full hover:bg-yellow-700 transition duration-300"
            onClick={onRetry}
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
};

export default ResultScreen;
