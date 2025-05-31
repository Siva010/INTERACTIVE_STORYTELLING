import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useTheme } from "../../context/ThemeContext";

const Navbar = ({ activeMenu, children }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative flex items-center justify-center border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <button
        className={`block lg:hidden absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-white" : "text-black"}`}
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>
      <h2 className={`mx-auto text-lg font-medium text-center ${isDark ? "text-white" : "text-black"}`}>Expense Tracker</h2>
      {children && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{children}</div>
      )}
      {openSideMenu && (
        <div className={`fixed top-[61px] -ml-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
