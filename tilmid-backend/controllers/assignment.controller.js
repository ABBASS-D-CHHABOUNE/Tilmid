const Assignment = require('../models/Assignment')
const fs = require('fs')
const path = require('path')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

exports.createAssignment = async (req, res) => {
  try {
    console.log('=== CREATE ASSIGNMENT DEBUG ===')
    console.log('req.user:', req.user)
    console.log('req.file:', req.file)
    console.log('req.body:', req.body)
    
    const { title, description, classId, dueDate, subject } = req.body
    
    console.log('Extracted data:', { title, description, classId, dueDate, subject })
    
    if (!req.user) {
      console.error('ERROR: req.user is undefined!')
      return res.status(401).json({ message: 'User not authenticated' })
    }
    
    const userId = req.user._id
    console.log('userId:', userId)

    if (!req.file) {
      console.error('ERROR: req.file is undefined!')
      return res.status(400).json({ message: 'File is required' })
    }

    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' })
    }

    const assignment = new Assignment({
      title,
      description,
      classId,
      teacherId: userId,
      userId,
      dueDate,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      attachmentType: req.file.mimetype.includes('pdf')
        ? 'PDF'
        : req.file.mimetype.includes('word')
        ? 'DOC'
        : req.file.mimetype.includes('image')
        ? 'IMAGE'
        : 'OTHER',
    })

    console.log('Assignment object created:', assignment)
    
    await assignment.save()
    
    console.log('Assignment saved successfully')
    
    res.status(201).json({
      message: 'Assignment created successfully',
      assignment,
    })
  } catch (error) {
    console.error('=== ASSIGNMENT CREATION ERROR ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    res.status(500).json({ message: error.message })
  }
}

exports.getAssignmentsByClass = async (req, res) => {
  try {
    console.log('=== GET ASSIGNMENTS BY CLASS ===')
    console.log('classId:', req.params.classId)
    
    const { classId } = req.params
    const assignments = await Assignment.find({ classId, isActive: true })
      .populate('teacherId', 'specialization')
      .populate('userId', 'firstName lastName')
      .sort({ dueDate: -1 })

    console.log('Found assignments:', assignments.length)
    
    res.json({ assignments })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.getTeacherAssignments = async (req, res) => {
  try {
    console.log('=== GET TEACHER ASSIGNMENTS ===')
    console.log('req.user:', req.user)
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }
    
    const teacherId = req.user._id
    console.log('teacherId:', teacherId)
    
    const assignments = await Assignment.find({ teacherId })
      .populate('classId', 'className')
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })

    console.log('Found assignments:', assignments.length)
    
    res.json({ assignments })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.getStudentAssignments = async (req, res) => {
  try {
    console.log('=== GET STUDENT ASSIGNMENTS ===')
    console.log('req.user:', req.user)
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }
    
    const Student = require('../models/Student')
    const studentId = req.user._id
    console.log('studentId:', studentId)

    // Get student's class first
    const student = await Student.findOne({ userId: studentId })
    console.log('Student found:', student)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const assignments = await Assignment.find({
      classId: student.classId,
      isActive: true,
    })
      .populate('teacherId', 'specialization')
      .populate('userId', 'firstName lastName')
      .sort({ dueDate: -1 })

    console.log('Found assignments:', assignments.length)
    
    res.json({ assignments })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.downloadAssignment = async (req, res) => {
  try {
    console.log('=== DOWNLOAD ASSIGNMENT ===')
    console.log('assignmentId:', req.params.assignmentId)
    
    const { assignmentId } = req.params
    const assignment = await Assignment.findById(assignmentId)

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    const filePath = path.join(__dirname, '../uploads', path.basename(assignment.fileUrl))
    console.log('filePath:', filePath)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' })
    }

    res.download(filePath)
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.deleteAssignment = async (req, res) => {
  try {
    console.log('=== DELETE ASSIGNMENT ===')
    console.log('assignmentId:', req.params.assignmentId)
    
    const { assignmentId } = req.params
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { isActive: false },
      { new: true }
    )

    console.log('Assignment marked as deleted')

    // Delete file
    const filePath = path.join(__dirname, '../uploads', path.basename(assignment.fileUrl))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log('File deleted from disk')
    }

    res.json({ message: 'Assignment deleted', assignment })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}