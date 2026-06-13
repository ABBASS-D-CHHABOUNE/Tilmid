const express = require('express')
const mentorController = require('../controllers/mentor.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/profile', mentorController.getProfile)
router.get('/students', mentorController.getStudents)
router.get('/students/:studentId/performance', mentorController.getStudentPerformance)
router.post('/sessions', mentorController.createSession)
router.get('/sessions', mentorController.getSessions)
router.post('/ratings', mentorController.createRating)
router.get('/ratings', mentorController.getRatings)
router.get('/alerts', mentorController.getAlerts)
router.get('/statistics', mentorController.getStatistics)

module.exports = router