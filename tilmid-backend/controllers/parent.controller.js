const Parent = require('../models/Parent')
const User = require('../models/User')
const Student = require('../models/Student')
const Grade = require('../models/Grade')
const Attendance = require('../models/Attendance')
const Assignment = require('../models/Assignment')
const MonthlyReport = require('../models/MonthlyReport')
const Mentor = require('../models/Mentor')
const MentorshipAssignment = require('../models/MentorshipAssignment')

// Get Parent Profile
exports.getProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email')

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' })
    }

    res.json(parent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Parent's Children
exports.getChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id })

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' })
    }

    const children = await Student.find({ 
      _id: { $in: parent.childrenIds || [] }
    }).populate('userId', 'firstName lastName email')
      .populate('classId', 'name')

    res.json(children)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Child Info (by childId)
exports.getChildInfo = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
      .populate('userId', 'firstName lastName email')
      .populate('classId', 'name')

    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    res.json(child)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Child Grades
exports.getChildGrades = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const grades = await Grade.find({ studentId: childId })
      .populate('teacherId', 'firstName lastName')
      .sort({ createdAt: -1 })

    res.json(grades)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Child Average/Performance
exports.getChildAverage = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const grades = await Grade.find({ studentId: childId })

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

// Get Child Alerts
exports.getChildAlerts = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const failingGrades = await Grade.find({ 
      studentId: childId, 
      status: 'REFUSE' 
    }).sort({ createdAt: -1 })

    const alerts = failingGrades.map(grade => ({
      _id: grade._id,
      type: 'FAILING_GRADE',
      subject: grade.subject,
      score: grade.score,
      message: `${child.userId.firstName} scored ${grade.score}/20 in ${grade.subject}`,
      severity: 'HIGH',
      createdAt: grade.createdAt
    }))

    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Child Attendance
exports.getChildAttendance = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const attendance = await Attendance.find({ studentId: childId })
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

// Get Child Mentor Info
exports.getChildMentor = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const assignment = await MentorshipAssignment.findOne({ 
      studentId: childId,
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

// Get Child Assignments
exports.getChildAssignments = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const assignments = await Assignment.find({ 
      $or: [
        { classId: child.classId },
        { studentId: childId }
      ]
    })
    .populate('teacherId', 'firstName lastName')
    .sort({ createdAt: -1 })

    res.json(assignments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Child Reports
exports.getChildReports = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const reports = await MonthlyReport.find({
      $or: [
        { classId: child.classId },
        { 'studentsPerformance.studentId': childId }
      ]
    }).sort({ submittedAt: -1 })

    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Child Performance Summary
exports.getChildPerformanceSummary = async (req, res) => {
  try {
    const { childId } = req.params

    const child = await Student.findById(childId)
      .populate('userId', 'firstName lastName')

    if (!child) {
      return res.status(404).json({ message: 'Child not found' })
    }

    const grades = await Grade.find({ studentId: childId })
    const attendance = await Attendance.find({ studentId: childId })

    if (grades.length === 0) {
      return res.json({
        childName: `${child.userId.firstName} ${child.userId.lastName}`,
        academic: {
          average: 0,
          status: 'NO_GRADES',
          passingSubjects: 0,
          failingSubjects: 0,
          totalSubjects: 0
        },
        attendance: {
          present: 0,
          absent: 0,
          late: 0,
          percentage: 0
        }
      })
    }

    const totalScore = grades.reduce((sum, g) => sum + (g.score * g.coefficient), 0)
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0)
    const average = (totalScore / totalCoefficient).toFixed(2)

    const passingSubjects = grades.filter(g => g.status === 'ADMIS').length
    const failingSubjects = grades.filter(g => g.status === 'REFUSE').length
    const status = average >= 10 ? 'ADMIS' : 'REFUSE'

    let attendanceData = {
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0
    }

    if (attendance.length > 0) {
      const present = attendance.filter(a => a.status === 'PRESENT').length
      const absent = attendance.filter(a => a.status === 'ABSENT').length
      const late = attendance.filter(a => a.status === 'LATE').length
      const percentage = ((present / attendance.length) * 100).toFixed(2)

      attendanceData = { present, absent, late, percentage }
    }

    res.json({
      childName: `${child.userId.firstName} ${child.userId.lastName}`,
      academic: {
        average,
        status,
        passingSubjects,
        failingSubjects,
        totalSubjects: grades.length
      },
      attendance: attendanceData
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}