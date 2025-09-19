const crypto = require("crypto");

const ALGO = "aes-256-cbc"; // can use aes-192-cbc if key shorter
const IV_LENGTH = 16;

// Encrypt
function simpleEncrypt(text, key) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, crypto.scryptSync(key, "salt", 32), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted; // include IV for decryption
}

// Decrypt
function simpleDecrypt(encryptedText, key) {
  const [ivBase64, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(ALGO, crypto.scryptSync(key, "salt", 32), iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { simpleEncrypt, simpleDecrypt };
