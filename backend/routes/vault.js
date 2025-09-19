const express = require("express");
const VaultItem = require("../models/VaultItem");
const auth = require("../middleware/auth");
const { simpleEncrypt, simpleDecrypt } = require("../utils/customCrypto");

const router = express.Router();
const ENC_KEY = process.env.ENC_KEY || "MySecretKey123";

// Create Vault Item
router.post("/", auth, async (req, res) => {
  const { website, username, password, notes } = req.body;
  try {
    const encryptedPassword = simpleEncrypt(password, ENC_KEY);
    const newItem = new VaultItem({
      user: req.user.id,
      website,
      username,
      password: encryptedPassword,
      notes,
    });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get Vault Items
router.get("/", auth, async (req, res) => {
  try {
    const items = await VaultItem.find({ user: req.user.id });
    //console.log("Items found:", items);

    const decrypted = items.map((item) => {
      let decryptedPassword;
      try {
        decryptedPassword = simpleDecrypt(item.password, ENC_KEY);
      } catch (e) {
        console.error("Decrypt error:", e.message);
        decryptedPassword = "⚠️ Failed to decrypt";
      }
      return { ...item._doc, password: decryptedPassword };
    });

    res.json(decrypted);
  } catch (err) {
    console.error("Error in GET /vault:", err);
    res.status(500).send("Server error");
  }
});


// Update Vault Item
router.put("/:id", auth, async (req, res) => {
  const { website, username, password, notes } = req.body;
  try {
    const item = await VaultItem.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Not found" });
    if (item.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    item.website = website || item.website;
    item.username = username || item.username;
    if (password) item.password = simpleEncrypt(password, ENC_KEY);
    item.notes = notes || item.notes;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete Vault Item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await VaultItem.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Not found" });
    if (item.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await item.deleteOne();
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
