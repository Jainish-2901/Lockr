import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, resetPassword } from "../api"; // your backend API calls
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDchWOSpba6jUBRUOGjgfzh17l7FME2tb8",
  authDomain: "lockr-saffe.firebaseapp.com",
  projectId: "lockr-saffe",
  storageBucket: "lockr-saffe.firebasestorage.app",
  messagingSenderId: "32723440153",
  appId: "1:32723440153:web:0cded7a68ceffa63179088",
  measurementId: "G-9QGR9MCT7D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  const navigate = useNavigate();

  // -------- Email/Password login states
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // -------- OTP reset states
  const [showOtpFlow, setShowOtpFlow] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  // -------- Handlers for email/password login
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  // -------- OTP flow
  const isValidPhone = (number) => /^\+\d{10,15}$/.test(number);

  const initRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

      // Only for localhost testing
      if (window.location.hostname === "localhost") {
        if ("appVerificationDisabledForTesting" in window.recaptchaVerifier) {
          window.recaptchaVerifier.appVerificationDisabledForTesting = true;
        }
      }

      await window.recaptchaVerifier.render();
    }
  };

  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      setMessage("Enter a valid phone number with country code (e.g., +91XXXXXXXXXX)");
      return;
    }

    try {
      await initRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent to your phone!");
    } catch (err) {
      console.error("Send OTP error:", err);
      setMessage(err.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      setMessage("Please request OTP first.");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      setMessage("OTP verified! Now set your new password.");
    } catch (err) {
      console.error("Verify OTP error:", err);
      setMessage("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage("Enter a new password.");
      return;
    }

    try {
      await resetPassword({ phone, newPassword }); // call backend to update password
      setMessage("Password reset successful! Please login with new password.");

      // reset OTP states
      setShowOtpFlow(false);
      setPhone("");
      setOtp("");
      setNewPassword("");
      setConfirmationResult(null);
      window.recaptchaVerifier = null;
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage(err.response?.data?.msg || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      {!showOtpFlow ? (
        // -------- LOGIN FORM ----------
        <form
          onSubmit={handleLogin}
          className="backdrop-blur-xl bg-white/70 border border-gray-100 shadow-xl rounded-2xl p-8 w-96 space-y-5"
        >
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 text-sm">Login to your account</p>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2 text-center">
              {error}
            </p>
          )}

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />

          <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300">
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Forgot your password?{" "}
            <button
              type="button"
              onClick={() => setShowOtpFlow(true)}
              className="text-sky-500 font-medium hover:underline transition"
            >
              Reset via OTP
            </button>
          </p>

          <p className="text-sm text-center text-gray-600">
            New here?{" "}
            <Link to="/signup" className="text-sky-500 font-medium hover:underline transition">
              Sign Up
            </Link>
          </p>
        </form>
      ) : (
        // -------- OTP RESET FLOW ----------
        <div className="backdrop-blur-xl bg-white/70 border border-gray-100 shadow-xl rounded-2xl p-8 w-96 space-y-5">
          <h2 className="text-center font-bold text-xl">Reset Password via OTP</h2>
          {message && <p className="text-red-500 text-center">{message}</p>}

          <input
            type="text"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition mb-2"
          />
          <div id="recaptcha-container"></div>

          {!confirmationResult ? (
            <button
              onClick={sendOtp}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
            >
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition mb-2"
              />
              <button
                onClick={verifyOtp}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md hover:shadow-lg transition duration-300 mb-2"
              >
                Verify OTP
              </button>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition mb-2"
              />
              <button
                onClick={handleResetPassword}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
              >
                Reset Password
              </button>
            </>
          )}

          <button
            onClick={() => setShowOtpFlow(false)}
            className="w-full py-2 rounded-xl text-gray-500 hover:underline"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
