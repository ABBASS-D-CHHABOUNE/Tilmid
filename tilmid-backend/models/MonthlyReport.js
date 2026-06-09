const mongoose = require('mongoose');

const MonthlyReportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  content: String,
  status: { type: String, enum: ['PENDING', 'APPROVED', 'ACTION_REQUIRED'], default: 'PENDING' },
  reviewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNotes: String,
  reviewedAt: Date,
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MonthlyReport', MonthlyReportSchema);