const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  leetcodeUsername: { type: String, unique: true, sparse: true },
  neetcodeGithubRepo: { type: String, unique: true, sparse: true },
  lastKnownSubmissionAt: Date,
});

module.exports = mongoose.model('User', UserSchema);