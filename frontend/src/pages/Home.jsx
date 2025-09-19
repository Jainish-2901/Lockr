import { motion } from "framer-motion";
import { Shield, Lock, Zap, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight 
                       bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Lockr — Your Personal Password Vault
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Securely store, manage, and access your passwords from anywhere.  
            Designed with privacy and simplicity in mind.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                         shadow-md hover:shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Why Choose Lockr?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-10 h-10 text-indigo-600" />, title: "Secure Encryption", desc: "Your data is protected with advanced encryption." },
              { icon: <Zap className="w-10 h-10 text-indigo-600" />, title: "Fast & Easy", desc: "Save, edit, and access your passwords in seconds." },
              { icon: <Smartphone className="w-10 h-10 text-indigo-600" />, title: "Access Anywhere", desc: "Your vault is available on all your devices." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md bg-white"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Jainish Dabgar", text: "Lockr makes password management effortless. Super clean UI!" },
              { name: "Pratik Jivrajani", text: "I finally feel secure with my credentials. Highly recommend it." },
              { name: "Kruparthsinh Kher", text: "The best password manager I've used. Simple yet powerful." },
              { name: "Nehal Sheth", text: "Easy to use and very reliable. Love the design!" },
              { name: "Om Patel", text: "Lockr saved me so much time. Perfect for daily use." },
            ].map((review, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-xl bg-white shadow border border-gray-200"
              >
                <p className="text-gray-600 italic mb-4">“{review.text}”</p>
                <h4 className="font-semibold text-indigo-600">{review.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Lockr. All rights reserved.
      </footer>
    </div>
  );
}
