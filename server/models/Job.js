const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    title: { type: String, required: true },
    locations: [{ type: String }],
    url: { type: String },
    active: { type: Boolean, default: true },
    datePosted: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);