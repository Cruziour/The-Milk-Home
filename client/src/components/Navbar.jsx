import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", to: "/home" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    { name: "Manage Milk", to: "/managemilk" },
    { name: "Add Vendor", to: "/addvendor" },
    { name: "Update Vendor", to: "/updatevendor" },
    { name: "Report", to: "/reports" },
    { name: "Config", to: "/config" },
  ];

  return (
    <nav className="bg-indigo-600 border-b border-indigo-700 px-4 md:px-8 py-3 sticky top-0 z-50 shadow-md text-white">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-cyan-300 focus:outline-none transition-transform active:scale-90"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu - NavLink ka use */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              // NavLink humein isActive property deta hai automatically styling ke liye
              className={({ isActive }) =>
                `font-bold text-[13px] uppercase tracking-wider transition-all duration-200 pb-1 border-b-2 ${
                  isActive
                    ? "border-cyan-400 text-cyan-300"
                    : "border-transparent text-white hover:text-cyan-200 hover:border-cyan-200"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right border-r border-indigo-400 pr-4">
            <span className="text-indigo-200 text-[10px] block leading-none uppercase tracking-widest">
              Admin Panel
            </span>
            <span className="font-bold text-sm">Hi, admin</span>
          </div>
          <button className="bg-white text-indigo-700 px-4 py-1.5 rounded text-xs font-black hover:bg-red-50 hover:text-red-600 transition-all shadow-sm">
            LOGOUT
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-2xl absolute left-4 right-4 p-2 border border-gray-200">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block py-3 px-4 rounded-md font-bold text-sm mb-1 transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
