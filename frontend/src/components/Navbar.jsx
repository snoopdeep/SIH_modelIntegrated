import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex space-x-10 justify-center bg-[#405D72] py-2 text-white">
      <a href="/">Home</a>
      <a href="/">Authenticate</a>
      <a href="/">Contact Us</a>
    </nav>
  );
};

export default Navbar;
