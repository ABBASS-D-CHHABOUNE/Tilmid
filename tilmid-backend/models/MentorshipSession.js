const mongoose = require('mongoose');

const MentorshipSessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  duration: Number, // in minutes
  topic: String,
  notes: String,
  studentFeedback: String,
  sessionType: { type: String, enum: ['ACADEMIC', 'BEHAVIORAL', 'GUIDANCE'], default: 'ACADEMIC' }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipSession', MentorshipSessionSchema);