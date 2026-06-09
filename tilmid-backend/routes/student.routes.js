const express = require('express');
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Student profile
router.get('/profile', studentController.getProfile);

// Student grades
router.get('/grades', studentController.getGrades);

// Student moyenne
router.get('/moyenne', studentController.getMoyenne);

// Student alerts
router.get('/alerts', studentController.getAlerts);

// Mark alert as read
router.put('/alerts/:alertId/read', studentController.markAlertRead);

module.exports = router;