const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET);
};

const resetToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

module.exports = { generateToken, resetToken,generateOTP };


