import React from "react";
import { useTheme } from "../../context/ThemeContext";

const InfoCard = ({ icon, label, value, color }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`flex gap-6 ${color} p-6 rounded-2xl shadow-md border ${isDark ? "bg-gray-900 shadow-gray-900 border-gray-800 text-white" : "bg-white shadow-gray-100 border-gray-200/50"}`}
    >
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div className={isDark ? "text-white" : ""}>
        <h6 className={`text-sm mb-1 ${isDark ? "text-white" : "text-gray-500"}`}>{label}</h6>
        <span className={`text-[22px] ${isDark ? "text-white" : ""}`}>₹{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
