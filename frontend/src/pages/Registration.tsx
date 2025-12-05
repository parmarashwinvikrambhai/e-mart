import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/apiClient";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";


function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ name: "", email: "", password: "" });
    const newErrors = { name: "", email: "", password: "" };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
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
      return; // Stop submit if validation fails
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", { name, email, password });

      toast.success("Registration uccessfully", {
        style: {
          borderRadius: "8px",
          background: "#1e40af",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#1e40af",
        },
      });

      navigate("/login");

      setName("");
      setEmail("");
      setPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      toast.error(error.response?.data?.message || "Registration failed",{
        style: {
          borderRadius: "8px",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#dc2626",
        },
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
            Sign up
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>

        <form
          className="flex flex-col justify-center"
          onSubmit={handleRegistration}
        >
          <div className="flex flex-col gap-4">
            {/* Name Field */}
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" })); // clear error on change
                }}
                className="border w-[400px] p-2"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
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
          </div>

          <div className="flex justify-between mt-1">
            <Link to="/forgot-password" className="text-sm">
              Forgot your password?
            </Link>
            <Link to="/login" className="text-sm">
              Login Here
            </Link>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className={`border px-6 py-2 bg-black text-white ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
