const Student = require('../models/Student');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Alert = require('../models/Alert');
const GradingEngine = require('../lib/grading');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId })
      .populate('userId', 'email firstName lastName locale');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student grades
exports.getGrades = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    const grades = await Grade.find({ studentId: student._id })
      .sort({ createdAt: -1 });
    
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student moyenne
exports.getMoyenne = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    const grades = await Grade.find({ studentId: student._id });

    if (grades.length === 0) {
      return res.json({ message: 'No grades yet', moyenne: null, status: null });
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
      failingSubjects: result.failingSubjects,
      totalGrades: grades.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student alerts
exports.getAlerts = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    const alerts = await Alert.find({ studentId: student._id })
      .sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark alert as read
exports.markAlertRead = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndUpdate(alertId, { isRead: true }, { new: true });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};