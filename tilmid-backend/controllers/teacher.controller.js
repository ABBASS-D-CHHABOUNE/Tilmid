const Teacher = require('../models/Teacher')
const User = require('../models/User')
const Grade = require('../models/Grade')
const Class = require('../models/Class')
const Student = require('../models/Student')
const Attendance = require('../models/Attendance')
const MonthlyReport = require('../models/MonthlyReport')
const { calculateMoroccanGrade } = require('../lib/grading')

// Get Teacher Profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id }).populate('userId', 'firstName lastName email specialization')
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }
    
    res.json(teacher)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Teacher's Classes
exports.getClasses = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id })
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const classes = await Class.find({ _id: { $in: teacher.classesAssigned || [] } })
    
    res.json(classes || [])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Class Students
exports.getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params
    
    const classData = await Class.findById(classId)
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' })
    }

    const students = await Student.find({ classId }).populate('userId', 'firstName lastName email')
    
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create Grade (Add New Grade)
exports.createGrade = async (req, res) => {
  try {
    const { studentId, subject, score, coefficient, trimester, academicYear } = req.body

    // Validation
    if (!studentId || !subject || score === undefined || !coefficient) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (score < 0 || score > 20) {
      return res.status(400).json({ message: 'Score must be between 0 and 20' })
    }

    // Get teacher info
    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    // Calculate Moroccan grade status
    const status = calculateMoroccanGrade(score)

    // Create grade
    const grade = new Grade({
      studentId,
      teacherId: teacher._id,
      subject,
      score,
      coefficient,
      status,
      trimester: trimester || 1,
      academicYear: academicYear || new Date().getFullYear(),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await grade.save()

    res.status(201).json({
      message: 'Grade created successfully',
      grade
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Teacher's Grades
exports.getGrades = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id })
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const grades = await Grade.find({ teacherId: teacher._id })
      .populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 })
    
    res.json(grades)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update Grade
exports.updateGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    const { score, coefficient, trimester } = req.body

    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const grade = await Grade.findById(gradeId)
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' })
    }

    // Verify teacher owns this grade
    if (grade.teacherId.toString() !== teacher._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this grade' })
    }

    // Update fields
    if (score !== undefined) {
      if (score < 0 || score > 20) {
        return res.status(400).json({ message: 'Score must be between 0 and 20' })
      }
      grade.score = score
      grade.status = calculateMoroccanGrade(score)
    }
    
    if (coefficient !== undefined) grade.coefficient = coefficient
    if (trimester !== undefined) grade.trimester = trimester
    
    grade.updatedAt = new Date()
    await grade.save()

    res.json({
      message: 'Grade updated successfully',
      grade
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete Grade
exports.deleteGrade = async (req, res) => {
  try {
    const { gradeId } = req.params

    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const grade = await Grade.findById(gradeId)
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' })
    }

    // Verify teacher owns this grade
    if (grade.teacherId.toString() !== teacher._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this grade' })
    }

    await Grade.deleteOne({ _id: gradeId })

    res.json({ message: 'Grade deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, status, date } = req.body

    // Validation
    if (!studentId || !classId || !status || !date) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (!['PRESENT', 'ABSENT', 'LATE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use PRESENT, ABSENT, or LATE' })
    }

    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({ studentId, date: new Date(date) })
    
    if (existingAttendance) {
      existingAttendance.status = status
      existingAttendance.updatedAt = new Date()
      await existingAttendance.save()
      return res.json({ message: 'Attendance updated', attendance: existingAttendance })
    }

    // Create new attendance
    const attendance = new Attendance({
      studentId,
      classId,
      teacherId: teacher._id,
      status,
      date: new Date(date),
      createdAt: new Date()
    })

    await attendance.save()

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Attendance for Class
exports.getAttendance = async (req, res) => {
  try {
    const { classId } = req.params

    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const attendance = await Attendance.find({ classId })
      .populate('studentId', 'firstName lastName')
      .sort({ date: -1 })

    res.json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Submit Monthly Report
exports.submitReport = async (req, res) => {
  try {
    const { classId, month, year, notes, studentsPerformance } = req.body

    // Validation
    if (!classId || !month || !year) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    // Check if report already exists
    const existingReport = await MonthlyReport.findOne({ classId, month, year })
    if (existingReport) {
      return res.status(400).json({ message: 'Report already submitted for this month' })
    }

    // Create report
    const report = new MonthlyReport({
      classId,
      teacherId: teacher._id,
      month,
      year,
      notes: notes || '',
      studentsPerformance: studentsPerformance || [],
      status: 'PENDING',
      submittedAt: new Date(),
      createdAt: new Date()
    })

    await report.save()

    res.status(201).json({
      message: 'Report submitted successfully',
      report
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Teacher's Reports
exports.getReports = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id })
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const reports = await MonthlyReport.find({ teacherId: teacher._id })
      .populate('classId', 'name')
      .sort({ submittedAt: -1 })
    
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Student Performance (for a specific student)
exports.getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params

    const teacher = await Teacher.findOne({ userId: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    const grades = await Grade.find({ studentId, teacherId: teacher._id }).sort({ createdAt: -1 })
    
    if (grades.length === 0) {
      return res.status(404).json({ message: 'No grades found for this student' })
    }

    // Calculate average
    const totalScore = grades.reduce((sum, g) => sum + (g.score * g.coefficient), 0)
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0)
    const average = (totalScore / totalCoefficient).toFixed(2)

    // Count passing/failing
    const passing = grades.filter(g => g.status === 'ADMIS').length
    const failing = grades.filter(g => g.status === 'REFUSE').length

    res.json({
      studentId,
      grades,
      summary: {
        average,
        totalGrades: grades.length,
        passing,
        failing,
        status: average >= 10 ? 'ADMIS' : 'REFUSE'
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}