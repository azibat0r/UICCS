const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    daysPerWeek: { type: Number, required: true, min: 1, max: 7 },
    questionsPerDay: { type: Number, required: true, min: 1 },
    askToJoin: { type: Boolean, default: false },
    memberCap: { type: Number, default: 20 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        lastReminderSentAt: Date,
      },
    ],
    joinRequests: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);