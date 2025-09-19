const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));



// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/vault", require("./routes/vault"));
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack || err);
  res.status(500).json({ msg: "Something broke on the server" });
});


// Default route
app.get("/", (req, res) => res.send("Lockr API running..."));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
