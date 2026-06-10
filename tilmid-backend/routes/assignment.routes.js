const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const auth = require('../middleware/auth.middleware')
const assignmentController = require('../controllers/assignment.controller')

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
})

// Teacher routes
router.post(
  '/create',
  auth,
  upload.single('file'),
  assignmentController.createAssignment
)

router.get(
  '/teacher/my-assignments',
  auth,
  assignmentController.getTeacherAssignments
)

// Student routes
router.get(
  '/student/assignments',
  auth,
  assignmentController.getStudentAssignments
)

// Public routes
router.get('/class/:classId', assignmentController.getAssignmentsByClass)
router.get('/download/:assignmentId', assignmentController.downloadAssignment)

// Delete
router.delete('/:assignmentId', auth, assignmentController.deleteAssignment)

module.exports = router