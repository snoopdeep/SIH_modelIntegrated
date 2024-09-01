import React from "react";
import logo from "../../public/logo.png";
import aadhaar from "../../public/aadhaar.svg";

const Header = () => {
  return (
    <>
      <header className="bg-white shadow-md py-1 flex items-center justify-between px-24 pt-2 ">
        <button className="flex items-center">
          <img src={logo} alt="UIDAI Logo" className="h-10 w-16 mr-3" />{" "}
          <h1 className="text-lg font-sans text-gray-800">
            Face Liveness Detection
          </h1>
        </button>
        <div>
          <img src={aadhaar} alt="aadhaar icon" className="h-14" />
        </div>
      </header>
    </>
  );
};

export default Header;
