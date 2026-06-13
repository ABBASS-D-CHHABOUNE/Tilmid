const User = require('../models/User')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const Grade = require('../models/Grade')
const Class = require('../models/Class')
const MonthlyReport = require('../models/MonthlyReport')
const bcrypt = require('bcryptjs')

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ message: 'Admin profile', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = new User({ email, passwordHash: hash, firstName, lastName, role, isActive: true })
    await user.save()
    res.status(201).json({ message: 'User created', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createClass = async (req, res) => {
  try {
    const { name, level, academicYear, capacity } = req.body
    const newClass = new Class({ name, level, academicYear, capacity: capacity || 30 })
    await newClass.save()
    res.status(201).json({ message: 'Class created', class: newClass })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
    res.json(classes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(req.params.classId, req.body, { new: true })
    if (!classData) return res.status(404).json({ message: 'Class not found' })
    res.json({ message: 'Class updated', class: classData })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.classId)
    res.json({ message: 'Class deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getReports = async (req, res) => {
  try {
    const reports = await MonthlyReport.find().sort({ submittedAt: -1 })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.approveReport = async (req, res) => {
  try {
    const report = await MonthlyReport.findByIdAndUpdate(req.params.reportId, { status: 'APPROVED', reviewedAt: new Date() }, { new: true })
    if (!report) return res.status(404).json({ message: 'Report not found' })
    res.json({ message: 'Report approved', report })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.rejectReport = async (req, res) => {
  try {
    const report = await MonthlyReport.findByIdAndUpdate(req.params.reportId, { status: 'REJECTED', reviewedAt: new Date() }, { new: true })
    if (!report) return res.status(404).json({ message: 'Report not found' })
    res.json({ message: 'Report rejected', report })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getDashboardKPIs = async (req, res) => {
  try {
    const kpis = {
      totalStudents: await Student.countDocuments(),
      totalTeachers: await Teacher.countDocuments(),
      totalGrades: await Grade.countDocuments(),
      pendingReports: await MonthlyReport.countDocuments({ status: 'PENDING' }),
      failingStudents: await Grade.countDocuments({ status: 'REFUSE' })
    }
    res.json(kpis)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getFailingStudents = async (req, res) => {
  try {
    const failing = await Grade.find({ status: 'REFUSE' }).populate('studentId', 'firstName lastName')
    res.json(failing)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSystemStats = async (req, res) => {
  try {
    const stats = {
      totalGrades: await Grade.countDocuments(),
      passingGrades: await Grade.countDocuments({ status: 'ADMIS' }),
      failingGrades: await Grade.countDocuments({ status: 'REFUSE' }),
      pendingReports: await MonthlyReport.countDocuments({ status: 'PENDING' })
    }
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}