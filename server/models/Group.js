const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    focus: { type: String, required: true },        // e.g. "Daily LeetCode Grind", "Blind 75"
    description: String,                              // what the group will actually work on
    format: { type: String, enum: ['In Person', 'Remote'], required: true },
    frequency: { type: String, required: true },      // "Daily", "Weekly", "Biweekly"
    askToJoin: { type: Boolean, default: false },     // false = open, true = approval required
    memberCap: { type: Number, default: 20 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);