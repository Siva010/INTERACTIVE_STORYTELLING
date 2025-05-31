import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";
import { useTheme } from "../../context/ThemeContext";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext); // Assuming you have a UserContext to manage user state
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // SignUp API Call
    try {
      // Upload profile image if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
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
        <div className="w-full flex flex-col items-center justify-center pb-4 rounded-b-2xl bg-gradient-to-b from-indigo-500 to-indigo-300/70">
          <div className="w-12 h-12 rounded-full bg-indigo-400 flex items-center justify-center mb-2 mt-1">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.15" />
              <path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Expense Tracker</h1>
        </div>
        {/* Main form section */}
        <div className="px-2 sm:px-4 pt-4 pb-1">
          <h3 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-black"}`}>Create an Account</h3>
          <p className={`text-xs mt-1 mb-4 ${isDark ? "text-gray-300" : "text-slate-700"}`}>Join us today by entering your details below.</p>

          <form onSubmit={handleSignUp}>
            <div className="flex flex-col items-center mb-2">
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} size={56} />
            </div>
            <div className="flex flex-col gap-3">
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                label="Full Name"
                placeholder="Siva"
                type="text"
              />
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
            </div>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button type="submit" className="btn-primary mt-2 mb-1 py-2 text-base">SIGN UP</button>
            <p className={`text-[13px] mt-2 ${isDark ? "text-gray-200" : "text-slate-800"}`}>Already have an account? <Link className="font-medium text-primary underline" to="/login">Login</Link></p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
