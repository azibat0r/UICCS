const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  leetcodeUsername: String,
  neetcodeGithubRepo: String, // e.g. "azibat0r/neetcode-submissions"
  lastKnownSubmissionAt: Date,
});

module.exports = mongoose.model('User', UserSchema);