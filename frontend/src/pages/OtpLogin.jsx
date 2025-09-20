import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { resetPasswordOtp } from "../api"; // your backend API

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

export default function OtpLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  const isValidPhone = (number) => /^\+\d{10,15}$/.test(number);

  // Initialize reCAPTCHA properly
  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
      // ✅ Only for localhost testing
      if (window.location.hostname === "localhost") {
        window.recaptchaVerifier.appVerificationDisabledForTesting = true;
      }
    }
  };

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      setMessage("Enter a valid phone number with country code, e.g., +91XXXXXXXXXX");
      return;
    }

    try {
      initRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent to your phone!");
    } catch (error) {
      console.error("Send OTP error:", error);
      setMessage(error.message || "Failed to send OTP. Try again later.");
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    if (!confirmationResult) {
      setMessage("Please request OTP first.");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      setMessage("OTP verified! Now set your new password.");
    } catch (error) {
      console.error("Verify OTP error:", error);
      setMessage("Invalid OTP. Please try again.");
    }
  };

  // Step 3: Reset password via backend
  const resetPassword = async () => {
    if (!newPassword) {
      setMessage("Enter a new password.");
      return;
    }

    try {
      await resetPasswordOtp({ phone, newPassword });
      setMessage("Password reset successful!");

      // Clear state
      setPhone("");
      setOtp("");
      setNewPassword("");
      setConfirmationResult(null);
      window.recaptchaVerifier = null;
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage(error.response?.data?.msg || "Failed to reset password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Reset Password via OTP</h2>

      {!confirmationResult ? (
        <div>
          <input
            type="text"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <div id="recaptcha-container"></div>

          <button onClick={sendOtp} style={{ padding: "10px 20px" }}>
            Send OTP
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={verifyOtp} style={{ padding: "10px 20px", marginBottom: "10px" }}>
            Verify OTP
          </button>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={resetPassword} style={{ padding: "10px 20px" }}>
            Reset Password
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
