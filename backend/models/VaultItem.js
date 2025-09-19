const mongoose = require("mongoose");

const VaultItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    website: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // encrypted
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VaultItem", VaultItemSchema);
