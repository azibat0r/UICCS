const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    focus: { type: String, required: true },
    description: String,
    format: { type: String, enum: ['In Person', 'Remote'], required: true },
    frequency: { type: String, required: true },
    askToJoin: { type: Boolean, default: false },
    memberCap: { type: Number, default: 20 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);