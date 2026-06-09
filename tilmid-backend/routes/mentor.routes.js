const express = require('express');
const mentorController = require('../controllers/mentor.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Mentor profile & caseload
router.get('/profile', mentorController.getProfile);

// Students
router.get('/students', mentorController.getAssignedStudents);
router.get('/students/:studentId/performance', mentorController.getStudentPerformance);

// Mentorship sessions
router.post('/sessions', mentorController.logSession);
router.get('/sessions/:studentId', mentorController.getStudentSessions);

// Ratings
router.post('/ratings', mentorController.submitRating);
router.get('/ratings', mentorController.getRatings);

// Alerts
router.get('/alerts', mentorController.getCriticalAlerts);
router.put('/alerts/:alertId/read', mentorController.markAlertRead);

module.exports = router;