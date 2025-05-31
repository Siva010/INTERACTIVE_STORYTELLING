import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { useTheme } from "../../context/ThemeContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-gray-900 min-h-screen" : ""}`}>
      <Navbar activeMenu={activeMenu}>
        {/* Theme Toggle Icon Button (no text), always top right in navbar */}
        <button
          onClick={toggleTheme}
          className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-200 focus:outline-none ${isDark ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-white text-indigo-700 hover:bg-indigo-100"}`}
          aria-label="Toggle theme"
          style={{ zIndex: 100 }}
        >
          {isDark ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </button>
      </Navbar>
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className={`grow mx-5 ${isDark ? "bg-gray-900 min-h-screen" : ""}`}>{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;


