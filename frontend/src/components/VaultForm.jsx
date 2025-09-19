import { useState } from "react";
import { addVaultItem, getVaultItems } from "../api";

export default function VaultForm({ setItems }) {
  const [form, setForm] = useState({
    website: "",
    username: "",
    password: "",
    notes: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addVaultItem(form);
    const res = await getVaultItems();
    setItems(res.data);
    setForm({ website: "", username: "", password: "", notes: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website"
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md 
                     focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md 
                     focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
        {/* Password input with show/hide icon */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md 
                       focus:outline-none focus:ring-2 focus:ring-sky-400 transition pr-10"
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
        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md 
                     focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-3 rounded-xl font-semibold text-white 
                   bg-gradient-to-r from-sky-500 to-indigo-500 
                   shadow-md hover:shadow-lg hover:scale-[1.02] 
                   transition duration-300"
      >
        + Add Entry
      </button>
    </form>
  );
}