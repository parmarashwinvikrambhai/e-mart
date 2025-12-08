import React, { useState } from "react";
import { Eye, EyeOff, Loader, X } from "lucide-react";
import axiosInstance from "../services/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [Password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({ Password: "", newPassword: "" });

  const navigate = useNavigate();

  const handleClose = () => {
    setShowForm(false);
    navigate("/profile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ Password: "", newPassword: "" });

    let valid = true;

    if (!Password.trim()) {
      setErrors((prev) => ({
        ...prev,
        Password: "Current password is required",
      }));
      valid = false;
    }
    if (!newPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      await axiosInstance.put("/auth/change-password", {
        Password,
        newPassword,
      });

      toast.success("Password changed successfully", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
      });

      setPassword("");
      setNewPassword("");
      setTimeout(() => {
        setShowForm(false);
        navigate("/profile");
      }, 600);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update password!",
        {
          style: {
            borderRadius: "8px",
            background: "#dc2626",
            color: "#fff",
            fontWeight: 600,
            padding: "12px 16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      {loading && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-9999">
          <Loader size={50} className="animate-spin text-black" />
        </div>
      )}
      <div className="bg-[#FFFFFF] rounded-2xl p-8 w-[450px] shadow-xl relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center justify-center">
            <h1
              className="text-2xl capitalize flex gap-2 tracking-wide"
              style={{ fontFamily: "Prata, serif" }}
            >
              change password
            </h1>
            <div className="w-10 h-0.5 bg-black"></div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-[400px] p-2 rounded-md"
              placeholder="Current Password"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </span>
            {errors.Password && (
              <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border w-[400px] p-2 rounded-md"
              placeholder="New Password"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </span>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-[150px] border px-2 py-2 bg-black text-white mt-4 rounded-lg ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
