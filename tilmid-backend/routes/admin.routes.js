const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

// All admin routes require authentication + ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// KPIs
router.get('/kpis', adminController.getKPIs);

// Students
router.get('/students', adminController.getStudents);
router.get('/students/unassigned', adminController.getUnassignedStudents);

// Mentors
router.get('/mentors', adminController.getMentors);
router.get('/mentors/workload', adminController.getMentorWorkload);
router.post('/assign-mentor', adminController.assignMentor);

// Teachers
router.get('/teachers', adminController.getTeachers);

// Reports
router.get('/reports/pending', adminController.getPendingReports);
router.put('/reports/:reportId/approve', adminController.approveReport);
router.put('/reports/:reportId/reject', adminController.rejectReport);

module.exports = router;