import React from "react";
import { Link } from "react-router-dom";
import CoinRain from "./CoinRain";
import { useTheme } from "../context/ThemeContext";

const FloatingCoin = ({ style, delay }) => (
  <svg
    className={`absolute animate-coin-spin`}
    style={{ ...style, animationDelay: delay }}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill="#facc15" />
    <circle cx="16" cy="16" r="10" fill="#fde68a" />
    <text x={16} y={21} textAnchor="middle" fontSize="14" fill="#b45309" fontWeight="bold">$</text>
  </svg>
);

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-indigo-100 via-white to-indigo-200"}`}>
      <CoinRain />
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg font-semibold transition-all duration-200 focus:outline-none ${isDark ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-white text-indigo-700 hover:bg-indigo-100"}`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/></svg>
        ) : (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        )}
        {isDark ? "Light" : "Dark"} Mode
      </button>
      {/* Decorative floating shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full opacity-30 animate-pulse-slow z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 rounded-full opacity-20 animate-float z-10" />
      {/* Animated floating coins */}
      <FloatingCoin style={{ top: '12%', left: '10%', zIndex: 10 }} delay="0s" />
      <FloatingCoin style={{ top: '70%', left: '20%', zIndex: 10 }} delay="1.5s" />
      <FloatingCoin style={{ top: '30%', right: '12%', zIndex: 10 }} delay="2.5s" />
      <FloatingCoin style={{ bottom: '18%', right: '18%', zIndex: 10 }} delay="0.8s" />
      <div className={`relative z-20 flex flex-col items-center max-w-2xl mx-auto py-16 ${isDark ? "text-white" : ""}`}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-slow">
          <circle cx="40" cy="40" r="40" fill="#6366f1"/>
          <rect x="22" y="36" width="36" height="20" rx="8" fill="#fff"/>
          <rect x="30" y="28" width="20" height="12" rx="6" fill="#a5b4fc"/>
          <rect x="36" y="44" width="8" height="8" rx="4" fill="#6366f1"/>
        </svg>
        <h1 className={`text-4xl md:text-5xl font-extrabold mt-6 mb-4 text-center leading-tight animate-text-pop ${isDark ? "text-white" : "text-indigo-700"}`}>
          Effortless Expense Tracking
        </h1>
        <p className={`text-lg md:text-xl mb-8 text-center max-w-xl animate-fade-in ${isDark ? "text-white" : "text-gray-700"}`}>
          Take control of your finances with our modern, intuitive expense tracker. Visualize your income and expenses, analyze trends, and achieve your financial goals—all in one place.
        </p>
        <div className="flex gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <Link to="/login" className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 ${isDark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
            Login
          </Link>
          <Link to="/signUp" className={`px-6 py-3 rounded-lg border font-semibold shadow transition-all duration-200 ${isDark ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800" : "bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50"}`}>
            Sign Up
          </Link>
        </div>
        {/* Animated Illustration */}
        <div className="w-full flex justify-center animate-slide-up">
          <svg width="340" height="160" viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="300" height="80" rx="20" fill="#fff" stroke="#6366f1" strokeWidth="2"/>
            <rect x="50" y="70" width="40" height="30" rx="8" fill="#a5b4fc"/>
            <rect x="110" y="60" width="40" height="40" rx="8" fill="#818cf8"/>
            <rect x="170" y="50" width="40" height="50" rx="8" fill="#6366f1"/>
            <rect x="230" y="80" width="40" height="20" rx="8" fill="#a5b4fc"/>
            <circle cx="70" cy="60" r="6" fill="#6366f1"/>
            <circle cx="130" cy="50" r="6" fill="#a5b4fc"/>
            <circle cx="190" cy="40" r="6" fill="#818cf8"/>
            <circle cx="250" cy="70" r="6" fill="#6366f1"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Landing; 