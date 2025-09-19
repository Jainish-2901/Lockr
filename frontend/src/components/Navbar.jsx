import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, Github, Menu, X, Home } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsOpen(false);
  };

  const token = localStorage.getItem("token");

  return (
  <nav className="bg-white/70 backdrop-blur-xl shadow-md px-6 sm:px-8 py-3 flex justify-between items-center w-full z-50 rounded-b-2xl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <Shield className="text-sky-500 w-7 h-7" />
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          Lockr
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-sky-500 transition">
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Home</span>
        </Link>
        <a
          href="https://github.com/Jainish-2901/Lockr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-500 hover:text-black transition"
        >
          <Github className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">GitHub</span>
        </a>
        {token && (
          <>
            <Link
              to="/dashboard"
              className="relative text-gray-600 hover:text-sky-500 transition group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-sky-500 transition-all group-hover:w-full"></span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-sky-500" onClick={() => setIsOpen(false)}>
            <Home className="w-5 h-5" /> Home
          </Link>
          <a
            href="https://github.com/Abdus-8747/Lockr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-700 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            <Github className="w-5 h-5" /> GitHub
          </a>
          {token && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-sky-500"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
