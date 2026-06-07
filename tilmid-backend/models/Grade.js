const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: String,
  score: { type: Number, min: 0, max: 20 },
  coefficient: { type: Number, default: 1 },
  status: { type: String, enum: ['ADMIS', 'REFUSE'] }
}, { timestamps: true });

module.exports = mongoose.model('Grade', GradeSchema);