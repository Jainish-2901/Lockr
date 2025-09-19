import { useState } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  // Real forgot password handler
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    try {
      await axios.post(`${process.env.VITE_API_URL}/api/auth/forgot-password`, { email: forgotEmail });
      setForgotMsg("If this email exists, a reset link has been sent.");
    } catch (err) {
      setForgotMsg("Failed to send reset link.");
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/70 border border-gray-100 
                   shadow-xl rounded-2xl p-8 w-96 space-y-5"
      >
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 text-sm">Login to your account</p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            {error}
          </p>
        )}

        {/* Inputs */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none 
                     focus:ring-2 focus:ring-sky-400 transition"
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none 
                       focus:ring-2 focus:ring-sky-400 transition pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off SVG
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.216.41 4.5 1.125M19.07 19.07A9.969 9.969 0 0021 12c0-3-4-7-9-7-1.657 0-3.216.41-4.5 1.125M3 3l18 18" />
              </svg>
            ) : (
              // Eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sky-500 text-sm hover:underline focus:outline-none"
            onClick={() => setShowForgot(true)}
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white 
                     bg-gradient-to-r from-sky-500 to-indigo-500 
                     shadow-md hover:shadow-lg hover:scale-[1.02] 
                     transition duration-300"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600">
          New here?{" "}
          <Link
            to="/signup"
            className="text-sky-500 font-medium hover:underline transition"
          >
            Sign Up
          </Link>
        </p>
      </form>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotMsg("");
                    setForgotEmail("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-600 text-white"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
              {forgotMsg && (
                <p className="text-sm text-center text-green-600 mt-2">{forgotMsg}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}