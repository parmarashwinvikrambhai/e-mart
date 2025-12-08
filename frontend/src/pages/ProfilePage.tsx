import { useState, useEffect } from "react";
import { Mail, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../services/apiClient";


const ProfilePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/get-profile", {
          withCredentials: true,
        });
        setUserData(res.data);

        // Set editable values
        setEditName(res.data.name);
        setEditEmail(res.data.email);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchUser();
  }, []);

  const updateProfile = async () => {
    try {
      await axiosInstance.put(
        "/auth/update-profile",
        {
          name: editName,
          email: editEmail,
        },
        { withCredentials: true }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUserData((prev: any) => ({
        ...prev,
        name: editName,
        email: editEmail,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePicUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axiosInstance.put("/auth/change-profilePic", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUserData((prev: any) => ({
        ...prev,
        profilePic: res.data.user.profilePic,
      }));
    } catch (error) {
      console.error("Profile picture update failed:", error);
    }
  };



  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-20">
      <div className="flex flex-col md:flex-row md:space-x-16 items-center md:items-start">
        {/* Left Section */}
        <div className="flex flex-col items-center mb-10 md:mb-0">
          <img
            src={userData.profilePic}
            alt="Profile"
            className="w-25 h-25 rounded-full object-cover mb-8 border-4 border-gray-100 shadow-inner cursor-pointer"
            onClick={() => document.getElementById("profilePic")?.click()}
          />

          <input
            type="file"
            id="profilePic"
            accept="image/*"
            className="hidden"
            onChange={handlePicUpload}
          />

          {!isEditing ? (
            <button
              className="w-full text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300 bg-green-400 hover:bg-green-500"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                className="px-6 py-2 rounded-full bg-blue-500 text-white"
                onClick={updateProfile}
              >
                Save
              </button>
              <button
                className="px-6 py-2 rounded-full bg-gray-400 text-white"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-between w-full md:w-auto">
          <div className="space-y-6 mb-10 md:mb-0">
            {/* Full Name */}
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-pink-500" />
              <p className="text-gray-700 text-lg">
                <span className="font-semibold mr-2">Name :</span>
                {!isEditing ? (
                  userData.name
                ) : (
                  <input
                    className="border rounded px-3 py-1"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                )}
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-pink-500" />
              <p className="text-gray-700 text-lg">
                <span className="font-semibold mr-2">Email :</span>
                {!isEditing ? (
                  userData.email
                ) : (
                  <input
                    className="border rounded px-3 py-1"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                )}
              </p>
            </div>

            {/* Joined On */}
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-pink-500" />
              <p className="text-gray-700 text-lg">
                <span className="font-semibold mr-2">Joined On :</span>
                {userData.joinDate}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 md:mt-12 space-y-3 w-full md:w-40 md:ml-auto">
            <Link to="/orders" className="block">
              <button className="w-40 h-10 text-white font-semibold rounded-full shadow-md transition duration-300 bg-green-400 hover:bg-green-500">
                My Orders
              </button>
            </Link>
            <Link to="/change-password" className="block">
              <button className="w-40 h-10 text-white font-semibold rounded-full shadow-md transition duration-300 bg-green-400 hover:bg-green-500">
                Change Password
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
