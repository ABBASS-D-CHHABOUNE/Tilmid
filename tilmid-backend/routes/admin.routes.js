const express = require('express')
const adminController = require('../controllers/admin.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authMiddleware)

// Profile
router.get('/profile', adminController.getProfile)

// Users
router.post('/users', adminController.createUser)
router.get('/users', adminController.getAllUsers)
router.get('/users/:userId', adminController.getUserById)
router.put('/users/:userId', adminController.updateUser)
router.delete('/users/:userId', adminController.deleteUser)

// Classes
router.post('/classes', adminController.createClass)
router.get('/classes', adminController.getAllClasses)
router.put('/classes/:classId', adminController.updateClass)
router.delete('/classes/:classId', adminController.deleteClass)

// Reports
router.get('/reports', adminController.getReports)
router.put('/reports/:reportId/approve', adminController.approveReport)
router.put('/reports/:reportId/reject', adminController.rejectReport)

// Analytics
router.get('/dashboard/kpis', adminController.getDashboardKPIs)
router.get('/analytics/failing-students', adminController.getFailingStudents)
router.get('/analytics/stats', adminController.getSystemStats)

module.exports = router