const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  maxCaseload: { type: Number, default: 20 },
  currentCaseload: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Mentor', MentorSchema);