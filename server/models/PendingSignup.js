const mongoose = require('mongoose');
const { Schema } = mongoose;

const PendingSignupSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // already hashed before storing
  linkedinUrl: String,
  githubUrl: String,
  personalWebsite: String,
  companies: [String],
  verificationCode: String,
  verificationCodeExpires: Date,
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // auto-deleted after 1 hour if abandoned
});

module.exports = mongoose.model('PendingSignup', PendingSignupSchema);