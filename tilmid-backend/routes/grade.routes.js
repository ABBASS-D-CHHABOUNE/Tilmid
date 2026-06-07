const express = require('express');
const gradeController = require('../controllers/grade.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', gradeController.createGrade);
router.get('/student/:studentId', gradeController.getStudentGrades);
router.get('/moyenne/:studentId', gradeController.getStudentMoyenne);
router.put('/:gradeId', gradeController.updateGrade);
router.delete('/:gradeId', gradeController.deleteGrade);

module.exports = router;