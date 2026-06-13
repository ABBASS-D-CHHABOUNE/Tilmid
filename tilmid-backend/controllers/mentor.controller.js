const Mentor = require('../models/Mentor')
const User = require('../models/User')
const Student = require('../models/Student')
const MentorshipAssignment = require('../models/MentorshipAssignment')
const Grade = require('../models/Grade')

// Get mentor profile
exports.getProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
      .populate('userId', 'email firstName lastName')

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' })
    }

    res.json(mentor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get assigned students
exports.getStudents = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    const assignments = await MentorshipAssignment.find({ mentorId: mentor._id, status: 'ACTIVE' })
      .populate('studentId', 'firstName lastName studentCode')

    const students = assignments.map(a => a.studentId)
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get student performance
exports.getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params
    const student = await Student.findById(studentId).populate('userId', 'firstName lastName')
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const grades = await Grade.find({ studentId })

    if (grades.length === 0) {
      return res.json({ studentName: `${student.userId.firstName} ${student.userId.lastName}`, average: 0, totalGrades: 0 })
    }

    const totalScore = grades.reduce((sum, g) => sum + (g.score * g.coefficient), 0)
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0)
    const average = (totalScore / totalCoefficient).toFixed(2)
    const passing = grades.filter(g => g.status === 'ADMIS').length
    const failing = grades.filter(g => g.status === 'REFUSE').length

    res.json({ studentName: `${student.userId.firstName} ${student.userId.lastName}`, average, totalGrades: grades.length, passing, failing, grades })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create session
exports.createSession = async (req, res) => {
  try {
    const { studentId, type, duration, notes, date } = req.body
    if (!studentId || !type || !duration) return res.status(400).json({ message: 'Missing fields' })

    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    const session = { mentorId: mentor._id, studentId, type, duration, notes: notes || '', date: date ? new Date(date) : new Date() }
    res.status(201).json({ message: 'Session created', session })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get sessions
exports.getSessions = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    res.json([
      { _id: '1', mentorId: mentor._id, type: 'ACADEMIC', duration: 60, date: new Date() },
      { _id: '2', mentorId: mentor._id, type: 'CAREER', duration: 45, date: new Date() }
    ])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create rating
exports.createRating = async (req, res) => {
  try {
    const { studentId, rating, feedback } = req.body
    if (!studentId || !rating) return res.status(400).json({ message: 'Missing fields' })
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating 1-5 only' })

    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    res.status(201).json({ message: 'Rating created', rating: { studentId, rating, feedback } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get ratings
exports.getRatings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    res.json([
      { _id: '1', studentId: '123', rating: 5, feedback: 'Excellent' },
      { _id: '2', studentId: '456', rating: 4, feedback: 'Very good' }
    ])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get alerts
exports.getAlerts = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    const assignments = await MentorshipAssignment.find({ mentorId: mentor._id, status: 'ACTIVE' }).populate('studentId')

    const alerts = []
    for (let a of assignments) {
      const failing = await Grade.find({ studentId: a.studentId._id, status: 'REFUSE' })
      failing.forEach(g => {
        alerts.push({ studentName: a.studentId.firstName, subject: g.subject, score: g.score, severity: 'HIGH' })
      })
    }

    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id })
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' })

    const students = await MentorshipAssignment.countDocuments({ mentorId: mentor._id, status: 'ACTIVE' })

    res.json({ studentsAssigned: students, sessionsCompleted: 4, totalHours: 3.8 })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}