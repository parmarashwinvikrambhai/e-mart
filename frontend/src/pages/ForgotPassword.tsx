import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post("/auth/forgot-password", { email });
      if (res.status === 200) {
        toast.success(res.data.message);
        setEmail("");
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
              Forgot Password
            </h1>
            <div className="w-10 h-0.5 bg-black"></div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-col gap-4">
              <input
                type="email"
                className="border w-[400px] p-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-around mt-10">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="border px-6 py-2 bg-black text-white disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "send"}
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

export default ForgotPassword;