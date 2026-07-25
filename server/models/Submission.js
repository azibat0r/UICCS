const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubmissionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problemName: String,
  timestamp: { type: Date, required: true },
  source: { type: String, enum: ['leetcode', 'neetcode'] },
});

// Prevents the same submission from being recorded twice if we check again later.
SubmissionSchema.index({ user: 1, timestamp: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);