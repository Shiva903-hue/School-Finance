import React, { useState } from "react";
import bgImg from '../../assets/bg.svg'
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../auth/authenticateUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const response = authenticateUser(email, password);

    if (!response.success) {
      setError(response.message);
      toast.error("Login failed: " + response.message, {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    setError(""); // Clear any previous error
    toast.success("Login successful!", {
      position: "top-center",
      autoClose: 1500,
      onClose: () => {
        localStorage.setItem("userRole", response.role);

        // Redirect to dashboard based on role
        switch (response.role) {
          case "Addmin":
            navigate("/admin");
            break;
          case "Supervisor":
            navigate("/supervisor");
            break;
          case "Banker":
            navigate("/banker");
            break;
          case "User":
            navigate("/user");
            break;
          default:
            navigate("/");
        }
      },
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-wrap items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <ToastContainer />
      <div className="flex flex-col items-center w-full max-w-md shadow-2xl rounded-2xl bg-white p-10">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-8 text-center tracking-wide">
          Login
        </h2>
        <form onSubmit={handleLogin} className="w-full space-y-7">
          {/* Email */}
          <div>
            <label className="block text-base font-medium text-blue-800 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-blue-800 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-blue-50"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded-lg text-white font-semibold text-lg hover:bg-blue-700 transition-all"
          >
            Sign In
          </button>
          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
