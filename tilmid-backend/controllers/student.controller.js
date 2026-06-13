const Student = require('../models/Student')
const User = require('../models/User')
const Grade = require('../models/Grade')
const Alert = require('../models/Alert')
const Attendance = require('../models/Attendance')
const Assignment = require('../models/Assignment')
const Mentor = require('../models/Mentor')
const MentorshipAssignment = require('../models/MentorshipAssignment')
const { calculateMoroccanGrade } = require('../lib/grading')

// Get Student Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email')
      .populate('classId', 'name')

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Grades
exports.getGrades = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const grades = await Grade.find({ studentId: student._id })
      .populate('teacherId', 'firstName lastName')
      .sort({ createdAt: -1 })

    res.json(grades)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Average (Moyenne)
exports.getAverage = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const grades = await Grade.find({ studentId: student._id })

    if (grades.length === 0) {
      return res.json({
        average: 0,
        totalGrades: 0,
        passingGrades: 0,
        failingGrades: 0,
        status: 'NO_GRADES'
      })
    }

    const totalScore = grades.reduce((sum, g) => sum + (g.score * g.coefficient), 0)
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0)
    const average = (totalScore / totalCoefficient).toFixed(2)

    const passingGrades = grades.filter(g => g.status === 'ADMIS').length
    const failingGrades = grades.filter(g => g.status === 'REFUSE').length
    const status = average >= 10 ? 'ADMIS' : 'REFUSE'

    res.json({
      average,
      totalGrades: grades.length,
      passingGrades,
      failingGrades,
      status
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Alerts
exports.getAlerts = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Get failing grades (alerts)
    const failingGrades = await Grade.find({ 
      studentId: student._id, 
      status: 'REFUSE' 
    }).sort({ createdAt: -1 })

    const alerts = failingGrades.map(grade => ({
      _id: grade._id,
      type: 'FAILING_GRADE',
      subject: grade.subject,
      score: grade.score,
      message: `You scored ${grade.score}/20 in ${grade.subject}. Please seek help from your teacher.`,
      severity: 'HIGH',
      createdAt: grade.createdAt
    }))

    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Mentor Info
exports.getMentor = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const assignment = await MentorshipAssignment.findOne({ 
      studentId: student._id,
      status: 'ACTIVE'
    }).populate('mentorId')

    if (!assignment || !assignment.mentorId) {
      return res.status(404).json({ message: 'No mentor assigned' })
    }

    const mentor = await Mentor.findById(assignment.mentorId._id)
      .populate('userId', 'firstName lastName email')

    res.json(mentor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Attendance
exports.getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const attendance = await Attendance.find({ studentId: student._id })
      .sort({ date: -1 })

    if (attendance.length === 0) {
      return res.json({
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
        percentage: 0
      })
    }

    const present = attendance.filter(a => a.status === 'PRESENT').length
    const absent = attendance.filter(a => a.status === 'ABSENT').length
    const late = attendance.filter(a => a.status === 'LATE').length
    const total = attendance.length
    const percentage = ((present / total) * 100).toFixed(2)

    res.json({
      present,
      absent,
      late,
      total,
      percentage,
      records: attendance
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Assignments
exports.getAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const assignments = await Assignment.find({ 
      $or: [
        { classId: student.classId },
        { studentId: student._id }
      ]
    })
    .populate('teacherId', 'firstName lastName')
    .sort({ createdAt: -1 })

    res.json(assignments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Download Assignment
exports.downloadAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params

    const assignment = await Assignment.findById(assignmentId)

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    if (!assignment.fileUrl) {
      return res.status(404).json({ message: 'No file attached to this assignment' })
    }

    res.json({
      message: 'Assignment file ready for download',
      fileName: assignment.fileName,
      fileUrl: assignment.fileUrl,
      fileSize: assignment.fileSize
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Performance Summary
exports.getPerformanceSummary = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const grades = await Grade.find({ studentId: student._id })

    if (grades.length === 0) {
      return res.json({
        summary: {
          average: 0,
          status: 'NO_GRADES',
          passingSubjects: 0,
          failingSubjects: 0,
          totalSubjects: 0
        }
      })
    }

    const totalScore = grades.reduce((sum, g) => sum + (g.score * g.coefficient), 0)
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0)
    const average = (totalScore / totalCoefficient).toFixed(2)

    const passingSubjects = grades.filter(g => g.status === 'ADMIS').length
    const failingSubjects = grades.filter(g => g.status === 'REFUSE').length
    const status = average >= 10 ? 'ADMIS' : 'REFUSE'

    res.json({
      summary: {
        average,
        status,
        passingSubjects,
        failingSubjects,
        totalSubjects: grades.length,
        grades: grades.map(g => ({
          subject: g.subject,
          score: g.score,
          status: g.status
        }))
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}