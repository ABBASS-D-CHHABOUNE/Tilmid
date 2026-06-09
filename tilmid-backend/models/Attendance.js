const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);