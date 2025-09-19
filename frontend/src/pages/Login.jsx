import { useState } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

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
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none 
                     focus:ring-2 focus:ring-sky-400 transition"
        />

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
    </div>
  );
}
