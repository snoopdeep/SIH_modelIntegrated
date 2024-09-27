import React from 'react';

const SuccessfulLiveness = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-green-100 shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="text-2xl font-bold text-green-600 mb-6">
        Liveness Verification Successful!
      </p>
      <p className="text-lg text-gray-600">
        Your liveness has been successfully verified. Thank you for your cooperation!
      </p>
      <button
        className="mt-4 py-3 px-6 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300"
        onClick={() => window.location.reload()} // Reload or navigate to another page as needed
      >
        Done
      </button>
    </div>
  );
};

export default SuccessfulLiveness;
