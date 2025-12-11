import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import axiosInstance from "../services/apiClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });

    // Frontend validation
    let valid = true;
    const newErrors = { email: "", password: "" };
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login",{ email, password },{ withCredentials: true });

      dispatch(setUser(res.data.user));
      

      toast.success(res.data.message || "Login successful", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: { primary: "#fff", secondary: "#1e40af" },
      });
      
      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/", { replace: true });
      }

     
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed", {
        style: {
          borderRadius: "8px",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: { primary: "#fff", secondary: "#dc2626" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[500px]">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center justify-center">
          <h1
            className="text-3xl capitalize flex gap-2 tracking-wide"
            style={{ fontFamily: "Prata, serif" }}
          >
            Login
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className="border w-[400px] p-2"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password and Links grouped for tighter spacing */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className="border w-[400px] p-2"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-between">
              <Link to="/forgot-password" className="text-sm">
                Forgot your password?
              </Link>
              <Link to="/registration" className="text-sm">
                Create account
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`border px-10 py-2 bg-black text-white mt-4 font-light hover:bg-gray-800 transition-colors w-1/2 mx-auto ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
