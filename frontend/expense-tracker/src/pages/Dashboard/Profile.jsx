import React, { useContext, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useTheme } from "../../context/ThemeContext";

const Profile = () => {
  useUserAuth();
  const { user, updateUser } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleProfileUpdate = async () => {
    if (!profilePic) {
      setError("Please select a profile picture");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Upload the new profile image
      const imgUploadRes = await uploadImage(profilePic);
      if (!imgUploadRes?.imageUrl) {
        throw new Error("Failed to get image URL from upload response");
      }
      const profileImageUrl = imgUploadRes.imageUrl;

      // Update user profile with new image URL
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        profileImageUrl,
      });

      if (response.data) {
        updateUser(response.data);
        setSuccess("Profile picture updated successfully!");
        setProfilePic(null);
      } else {
        throw new Error("No response data received from profile update");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "Failed to update profile picture. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="max-w-2xl mx-auto">
        <h2 className={`text-2xl font-semibold mb-6 ${isDark ? "text-white" : "text-black"}`}>Profile Settings</h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user?.fullName}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <button
            onClick={handleProfileUpdate}
            disabled={loading || !profilePic}
            className={`btn-primary w-full ${(loading || !profilePic) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Profile Picture'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile; 