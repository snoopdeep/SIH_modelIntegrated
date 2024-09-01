import React from 'react';
import Authentication from '../../public/authentication.svg'

const HomeScreen = ({ next }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white shadow-lg p-8 rounded-lg mx-4 md:mx-auto max-w-2xl mt-3">
      <p className='bg-top-gradient h-1 relative top-0 w-[42rem] mt-[-2rem] rounded-lg'></p>
      <img src={Authentication} alt="Authentication" className="w-32 h-32 mb-4 mt-4" /> 
      <h2 className="text-3xl font-bold text-gradient mb-4 ">Welcome to Aadhaar Face Authentication</h2>
      <p className="mb-8  text-gray-600">
        Securely authenticate your identity using facial recognition technology. Click the button below to start the process. Ensure you have good lighting and your face is clearly visible.
      </p>
      <button
        className="bg-[#3d3d8e] text-white py-3 px-6 rounded-md shadow-md drop-shadow-md shadow-black hover:bg-[#4a4ab2] transition duration-300"
        onClick={next}
      >
        Start Face Authentication
      </button>
    </div>
  );
};

export default HomeScreen;
