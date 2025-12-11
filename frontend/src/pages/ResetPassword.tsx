import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import apiClient from "../services/apiClient";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    const currentPos = inputRef.current?.selectionStart || 0;
    setShowPassword(!showPassword);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(currentPos, currentPos);
      }
    }, 0);
  };

  const handleSubmit = async () => {
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post(`/auth/reset-password/${token}`, { password });
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="flex justify-center items-center h-[500px]">
        <div className="flex flex-col gap-5">
          <div className="flex gap-2 items-center justify-center">
            <h1
              className="text-3xl capitalize flex gap-2 tracking-wide"
              style={{ fontFamily: "Prata, serif" }}
            >
              Reset Password
            </h1>
            <div className="w-10 h-0.5 bg-black"></div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-col gap-4 relative">
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-[400px] p-2 pr-10"
                placeholder="New Password"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div className="flex justify-around mt-10">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="border px-6 py-2 bg-black text-white disabled:bg-gray-400"
              >
                {loading ? "Resetting..." : "Reset"}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border px-6 py-2 bg-black text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;