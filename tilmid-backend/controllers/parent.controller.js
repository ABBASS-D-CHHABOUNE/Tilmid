const Parent = require('../models/Parent');
const User = require('../models/User');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Alert = require('../models/Alert');
const MonthlyReport = require('../models/MonthlyReport');
const MentorshipAssignment = require('../models/MentorshipAssignment');
const Mentor = require('../models/Mentor');
const GradingEngine = require('../lib/grading');

// Get parent profile
exports.getProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId })
      .populate('userId', 'email firstName lastName');

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    res.json(parent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get parent's child (student they manage)
exports.getChild = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });

    if (!parent.activeChildId) {
      return res.status(404).json({ message: 'No child assigned' });
    }

    const child = await Student.findById(parent.activeChildId)
      .populate('userId', 'email firstName lastName')
      .populate('classId', 'name level');

    res.json(child);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Switch active child (if parent has multiple children)
exports.switchChild = async (req, res) => {
  try {
    const { childId } = req.body;

    if (!childId) {
      return res.status(400).json({ message: 'childId required' });
    }

    const parent = await Parent.findOneAndUpdate(
      { userId: req.userId },
      { activeChildId: childId },
      { new: true }
    ).populate('activeChildId', 'firstName lastName');

    res.json({
      message: 'Active child switched',
      parent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get child's grades
exports.getChildGrades = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = req.params.childId || parent.activeChildId;

    const grades = await Grade.find({ studentId: childId })
      .populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      childId,
      count: grades.length,
      grades
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get child's performance (moyenne, status, alerts)
exports.getChildPerformance = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = req.params.childId || parent.activeChildId;

    const student = await Student.findById(childId)
      .populate('userId', 'firstName lastName email');

    const grades = await Grade.find({ studentId: childId });
    const alerts = await Alert.find({ studentId: childId });
    const reports = await MonthlyReport.find({ studentId: childId });

    let moyenne = null;
    let status = null;
    let failingSubjects = [];

    if (grades.length > 0) {
      const subjects = grades.map(g => ({
        subjectName: g.subject,
        score: g.score,
        coefficient: g.coefficient
      }));
      const result = GradingEngine.calculateMoyenne(subjects);
      moyenne = result.moyenne;
      status = result.status;
      failingSubjects = result.failingSubjects;
    }

    res.json({
      student,
      performance: {
        moyenne,
        status,
        failingSubjects,
        totalGrades: grades.length,
        alertsCount: alerts.length,
        reportsCount: reports.length
      },
      recentAlerts: alerts.slice(0, 5),
      recentReports: reports.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get child's alerts
exports.getChildAlerts = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = req.params.childId || parent.activeChildId;

    const alerts = await Alert.find({ studentId: childId })
      .sort({ createdAt: -1 });

    res.json({
      childId,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get child's monthly reports
exports.getChildReports = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = req.params.childId || parent.activeChildId;

    const reports = await MonthlyReport.find({ studentId: childId })
      .populate('teacherId', 'firstName lastName')
      .populate('reviewedById', 'firstName lastName')
      .sort({ createdAt: -1 });

    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'PENDING').length,
      approved: reports.filter(r => r.status === 'APPROVED').length,
      actionRequired: reports.filter(r => r.status === 'ACTION_REQUIRED').length
    };

    res.json({
      childId,
      stats,
      reports
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get child's mentor info
exports.getChildMentor = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = req.params.childId || parent.activeChildId;

    const assignment = await MentorshipAssignment.findOne({
      studentId: childId,
      isActive: true
    }).populate({
      path: 'mentorId',
      populate: { path: 'userId', select: 'firstName lastName email' }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'No mentor assigned' });
    }

    res.json({
      mentor: assignment.mentorId,
      assignment: {
        isActive: assignment.isActive,
        assignedAt: assignment.assignedAt,
        notes: assignment.notes
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rate mentor (parent satisfaction)
exports.rateMentor = async (req, res) => {
  try {
    const { mentorId, rating, feedback } = req.body;
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = parent.activeChildId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const assignment = await MentorshipAssignment.findOne({
      mentorId,
      studentId: childId
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Mentor not found for this child' });
    }

    assignment.parentRating = rating;
    assignment.parentFeedback = feedback;
    await assignment.save();

    res.json({
      message: 'Mentor rating submitted',
      assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mentor feedback (what mentor says about the child)
exports.getMentorFeedback = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    const childId = req.params.childId || parent.activeChildId;

    const assignment = await MentorshipAssignment.findOne({
      studentId: childId,
      isActive: true
    }).populate({
      path: 'mentorId',
      populate: { path: 'userId', select: 'firstName lastName' }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'No mentor assigned' });
    }

    res.json({
      childId,
      mentor: assignment.mentorId.userId,
      feedback: {
        mentorNotes: assignment.notes,
        mentorRating: assignment.studentRating,
        studentFeedback: assignment.studentFeedback
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};