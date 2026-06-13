const mongoose = require('mongoose');

const MonthlyReportSchema = new mongoose.Schema({
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',
    required: true
  },
  month: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 12 
  },
  year: { 
    type: Number, 
    required: true 
  },
  notes: {
    type: String,
    default: ''
  },
  studentsPerformance: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      notes: String
    }
  ],
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  reviewedById: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewNotes: String,
  reviewedAt: Date,
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('MonthlyReport', MonthlyReportSchema);