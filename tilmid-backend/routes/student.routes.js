const express = require('express')
const studentController = require('../controllers/student.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authMiddleware)

// Profile
router.get('/profile', studentController.getProfile)

// Grades & Performance
router.get('/grades', studentController.getGrades)
router.get('/average', studentController.getAverage)
router.get('/performance', studentController.getPerformanceSummary)

// Alerts
router.get('/alerts', studentController.getAlerts)

// Mentor
router.get('/mentor', studentController.getMentor)

// Attendance
router.get('/attendance', studentController.getAttendance)

// Assignments
router.get('/assignments', studentController.getAssignments)
router.get('/assignments/:assignmentId/download', studentController.downloadAssignment)

module.exports = router