const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://lockr-safe.vercel.app", credentials: true }));

// API Routes
app.use("/api/auth", require("./routes/auth"));   // Auth routes (register, login, forgot-password)
app.use("/api/vault", require("./routes/vault")); // Vault routes

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack || err);
  res.status(500).json({ msg: "Something broke on the server" });
});

// Serve React build files
app.use(express.static(path.join(__dirname, "dist"))); // change "dist" to "client/dist" if needed

// Fallback route: serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  if (req.originalUrl.startsWith("/api")) return res.status(404).json({ msg: "API route not found" });
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
