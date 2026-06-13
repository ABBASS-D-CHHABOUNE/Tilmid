const express = require('express')
const parentController = require('../controllers/parent.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authMiddleware)

// Profile
router.get('/profile', parentController.getProfile)

// Children
router.get('/children', parentController.getChildren)
router.get('/children/:childId', parentController.getChildInfo)

// Child Grades & Performance
router.get('/children/:childId/grades', parentController.getChildGrades)
router.get('/children/:childId/average', parentController.getChildAverage)
router.get('/children/:childId/performance', parentController.getChildPerformanceSummary)

// Child Alerts
router.get('/children/:childId/alerts', parentController.getChildAlerts)

// Child Attendance
router.get('/children/:childId/attendance', parentController.getChildAttendance)

// Child Mentor
router.get('/children/:childId/mentor', parentController.getChildMentor)

// Child Assignments & Reports
router.get('/children/:childId/assignments', parentController.getChildAssignments)
router.get('/children/:childId/reports', parentController.getChildReports)

module.exports = router