const express = require('express');
const teacherController = require('../controllers/teacher.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Teacher profile
router.get('/profile', teacherController.getProfile);

// Classes
router.get('/classes', teacherController.getClasses);
router.get('/classes/:classId/students', teacherController.getClassStudents);

// Attendance
router.post('/attendance', teacherController.markAttendance);
router.get('/attendance/student/:studentId', teacherController.getStudentAttendance);
router.get('/attendance/class/:classId', teacherController.getClassAttendance);

// Reports
router.post('/reports', teacherController.submitMonthlyReport);
router.get('/reports', teacherController.getMyReports);

// Grades
router.get('/grades', teacherController.getMyGrades);

module.exports = router;