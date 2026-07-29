const mongoose = require('mongoose');
const { Schema } = mongoose;

const SurveySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    foundInternshipOpportunity: { type: Boolean, required: true },
    easierToStayConsistent: { type: Boolean, required: true },
    overallRating: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Survey', SurveySchema);