import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance"; // or correct path
import { API_PATHS } from "../../utils/apiPaths"; // or correct path
import { UserContext } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user); // Update user context
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center ">
        {/* Shaded header section */}
        <div className="w-full flex flex-col items-center justify-center pb-6 rounded-b-2xl bg-gradient-to-b from-indigo-500 to-indigo-300/70">
          <div className="w-16 h-16 rounded-full bg-indigo-400 flex items-center justify-center mb-3 mt-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.15" />
              <path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Expense Tracker</h1>
        </div>
        {/* Main form section */}
        <div className="px-4 sm:px-8 pt-8 pb-2">
          <h3 className={`text-xl font-semibold mb-1 ${isDark ? "text-white" : "text-black"}`}>Welcome back</h3>
          <p className={`text-xs mt-[5px] mb-6 ${isDark ? "text-gray-300" : "text-slate-700"}`}>Please Enter your details to login</p>

          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">
              LOGIN
            </button>

            <p className={`text-[13px] mt-3 ${isDark ? "text-gray-200" : "text-slate-800"}`}>
              Don't Have an account?{" "}
              <Link className="font-medium text-primary underline" to="/signup">
                SignUp
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
