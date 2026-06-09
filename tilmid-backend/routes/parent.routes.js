const express = require('express');
const parentController = require('../controllers/parent.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Parent profile
router.get('/profile', parentController.getProfile);

// Child management
router.get('/child', parentController.getChild);
router.put('/child/switch', parentController.switchChild);

// Child grades & performance
router.get('/child/grades', parentController.getChildGrades);
router.get('/child/grades/:childId', parentController.getChildGrades);
router.get('/child/performance', parentController.getChildPerformance);
router.get('/child/performance/:childId', parentController.getChildPerformance);

// Child alerts & reports
router.get('/child/alerts', parentController.getChildAlerts);
router.get('/child/alerts/:childId', parentController.getChildAlerts);
router.get('/child/reports', parentController.getChildReports);
router.get('/child/reports/:childId', parentController.getChildReports);

// Mentor interaction
router.get('/child/mentor', parentController.getChildMentor);
router.get('/child/mentor/:childId', parentController.getChildMentor);
router.post('/child/mentor/rate', parentController.rateMentor);
router.get('/child/mentor/feedback', parentController.getMentorFeedback);
router.get('/child/mentor/feedback/:childId', parentController.getMentorFeedback);

module.exports = router;