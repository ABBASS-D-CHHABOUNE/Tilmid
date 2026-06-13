const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  },
  subject: {
    type: String,
    required: true
  },
  score: { 
    type: Number, 
    min: 0, 
    max: 20,
    required: true
  },
  coefficient: { 
    type: Number, 
    default: 1 
  },
  status: { 
    type: String, 
    enum: ['ADMIS', 'REFUSE'],
    required: true
  },
  trimester: {
    type: Number,
    default: 1
  },
  academicYear: {
    type: String,
    default: new Date().getFullYear().toString()
  }
}, { timestamps: true });

module.exports = mongoose.model('Grade', GradeSchema);