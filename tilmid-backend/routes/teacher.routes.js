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

// Grades
router.post('/grades', teacherController.createGrade);
router.get('/grades', teacherController.getGrades);
router.put('/grades/:gradeId', teacherController.updateGrade);
router.delete('/grades/:gradeId', teacherController.deleteGrade);
router.get('/students/:studentId/performance', teacherController.getStudentPerformance);

// Attendance
router.post('/attendance', teacherController.markAttendance);
router.get('/attendance/:classId', teacherController.getAttendance);

// Reports
router.post('/reports', teacherController.submitReport);
router.get('/reports', teacherController.getReports);

module.exports = router;