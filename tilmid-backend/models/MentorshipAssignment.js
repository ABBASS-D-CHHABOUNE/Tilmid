const mongoose = require('mongoose');

const MentorshipAssignmentSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  isActive: { type: Boolean, default: true },
  notes: String,
  parentRating: { type: Number, min: 1, max: 5 },
  studentRating: { type: Number, min: 1, max: 5 },
  parentFeedback: String,
  studentFeedback: String,
  assignedAt: { type: Date, default: Date.now }
}, { timestamps: true });

MentorshipAssignmentSchema.index({ mentorId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('MentorshipAssignment', MentorshipAssignmentSchema);