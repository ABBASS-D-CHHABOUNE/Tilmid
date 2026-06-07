const Grade = require('../models/Grade');
const Alert = require('../models/Alert');
const GradingEngine = require('../lib/grading');

exports.createGrade = async (req, res) => {
  try {
    const { studentId, subject, score, coefficient, trimester, academicYear } = req.body;

    if (!studentId || !subject || score === undefined || !trimester || !academicYear) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const grade = new Grade({
      studentId,
      teacherId: req.userId,
      subject,
      score,
      coefficient,
      trimester,
      academicYear
    });

    await grade.save();

    const allGrades = await Grade.find({
      studentId,
      trimester,
      academicYear
    });

    if (allGrades.length > 0) {
      const subjects = allGrades.map(g => ({
        subjectName: g.subject,
        score: g.score,
        coefficient: g.coefficient
      }));

      const result = GradingEngine.calculateMoyenne(subjects);

      await Grade.updateMany(
        { studentId, trimester, academicYear },
        { moyenne: result.moyenne, status: result.status }
      );

      if (result.alertRequired) {
        const alert = new Alert({
          studentId,
          type: 'GRADE_ALERT',
          message: `Grade alert for ${result.failingSubjects.join(', ')} - Average: ${result.moyenne}/20`
        });
        await alert.save();
      }
    }

    res.json({
      message: 'Grade created successfully',
      grade,
      alertCreated: score < 10.0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ studentId });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentMoyenne = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ studentId });

    if (grades.length === 0) {
      return res.json({ message: 'No grades found', moyenne: null, status: null });
    }

    const subjects = grades.map(g => ({
      subjectName: g.subject,
      score: g.score,
      coefficient: g.coefficient
    }));

    const result = GradingEngine.calculateMoyenne(subjects);

    res.json({
      moyenne: result.moyenne,
      status: result.status,
      failingSubjects: result.failingSubjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;
    const { score } = req.body;

    const grade = await Grade.findByIdAndUpdate(gradeId, { score }, { new: true });
    res.json({ message: 'Grade updated', grade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;
    await Grade.findByIdAndDelete(gradeId);
    res.json({ message: 'Grade deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};