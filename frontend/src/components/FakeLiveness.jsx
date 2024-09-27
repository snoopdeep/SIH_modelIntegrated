import React from 'react';

const FakeLiveness = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-red-100 shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className="text-2xl font-bold text-red-600 mb-6">
        Liveness Verification Failed!
      </p>
      <p className="text-lg text-gray-600">
        The video submitted did not pass the liveness check. Please try again or contact support for assistance.
      </p>
      <button
        className="mt-4 py-3 px-6 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-300"
        onClick={() => window.location.reload()} // Reload or navigate to another page as needed
      >
        Retry
      </button>
    </div>
  );
};

export default FakeLiveness;
