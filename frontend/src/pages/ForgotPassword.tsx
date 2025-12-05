import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

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
            <div className="flex flex-col gap-4">
              <input
                type="email"
                className="border w-[400px] p-2"
                placeholder="Email"
              />
            </div>
            <div className="flex justify-around mt-10">
              <button className="border px-6 py-2 bg-black text-white">
                Reset
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

export default ForgotPassword