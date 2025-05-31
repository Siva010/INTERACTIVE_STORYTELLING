import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Only use showPassword state for password fields
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword((v) => !v);

  const isPassword = type === "password";

  return (
    <div>
      <label className={`text-[13px] mb-1 block ${isDark ? "text-white" : "text-slate-800"}`}>{label}</label>
      <div className="input-box">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-black placeholder-gray-500"
          value={value}
          onChange={(e) => onChange(e)}
        />
        {isPassword && (
          showPassword ? (
            <FaRegEyeSlash
              size={22}
              className="text-slate-400 cursor-pointer z-10"
              data-testid="eye-slash-icon"
              onClick={toggleShowPassword}
              key="eye-slash"
              {...(console.log('Render: FaRegEyeSlash'), {})}
            />
          ) : (
            <FaRegEye
              size={22}
              className="text-primary cursor-pointer z-10"
              data-testid="eye-icon"
              onClick={toggleShowPassword}
              key="eye"
              {...(console.log('Render: FaRegEye'), {})}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input;
