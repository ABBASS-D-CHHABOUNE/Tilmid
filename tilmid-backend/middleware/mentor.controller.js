const Mentor = require('../models/Mentor');
const User = require('../models/User');
const Student = require('../models/Student');
const MentorshipAssignment = require('../models/MentorshipAssignment');
const MentorshipSession = require('../models/MentorshipSession');
const Grade = require('../models/Grade');
const Alert = require('../models/Alert');
const GradingEngine = require('../lib/grading');

// Get mentor profile
exports.getProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.userId })
      .populate('userId', 'email firstName lastName');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({
      profile: mentor,
      caseload: {
        current: mentor.currentCaseload,
        max: mentor.maxCaseload,
        percentage: Math.round((mentor.currentCaseload / mentor.maxCaseload) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all assigned students (mentor's caseload)
exports.getAssignedStudents = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.userId });

    const assignments = await MentorshipAssignment.find({
      mentorId: mentor._id,
      isActive: true
    }).populate('studentId', 'firstName lastName studentCode')
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'email' }
      });

    res.json({
      count: assignments.length,
      students: assignments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single student performance (detailed view)
exports.getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate('userId', 'firstName lastName email');

    const grades = await Grade.find({ studentId });
    const alerts = await Alert.find({ studentId });
    const sessions = await MentorshipSession.find({ studentId })
      .sort({ date: -1 });

    let moyenne = null;
    let status = null;

    if (grades.length > 0) {
      const subjects = grades.map(g => ({
        subjectName: g.subject,
        score: g.score,
        coefficient: g.coefficient
      }));
      const result = GradingEngine.calculateMoyenne(subjects);
      moyenne = result.moyenne;
      status = result.status;
    }

    res.json({
      student,
      performance: {
        moyenne,
        status,
        totalGrades: grades.length,
        alertsCount: alerts.length,
        sessionsCount: sessions.length
      },
      recentAlerts: alerts.slice(0, 5),
      recentSessions: sessions.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Log mentorship session
exports.logSession = async (req, res) => {
  try {
    const { studentId, date, duration, topic, notes, sessionType } = req.body;

    if (!studentId || !date || !duration) {
      return res.status(400).json({ message: 'studentId, date, and duration required' });
    }

    const mentor = await Mentor.findOne({ userId: req.userId });

    const session = new MentorshipSession({
      mentorId: mentor._id,
      studentId,
      date: new Date(date),
      duration,
      topic,
      notes,
      sessionType: sessionType || 'ACADEMIC'
    });

    await session.save();

    res.json({
      message: 'Session logged successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sessions for a student
exports.getStudentSessions = async (req, res) => {
  try {
    const { studentId } = req.params;

    const sessions = await MentorshipSession.find({ studentId })
      .sort({ date: -1 });

    const stats = {
      total: sessions.length,
      academic: sessions.filter(s => s.sessionType === 'ACADEMIC').length,
      behavioral: sessions.filter(s => s.sessionType === 'BEHAVIORAL').length,
      guidance: sessions.filter(s => s.sessionType === 'GUIDANCE').length,
      totalMinutes: sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    };

    res.json({
      studentId,
      stats,
      sessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit satisfaction rating (parent or student rating mentor)
exports.submitRating = async (req, res) => {
  try {
    const { studentId, ratingSource, rating, feedback } = req.body;

    if (!studentId || !ratingSource || !rating) {
      return res.status(400).json({ 
        message: 'studentId, ratingSource (PARENT/STUDENT), and rating required' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const mentor = await Mentor.findOne({ userId: req.userId });

    const assignment = await MentorshipAssignment.findOne({
      mentorId: mentor._id,
      studentId
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Student not assigned to mentor' });
    }

    if (ratingSource === 'PARENT') {
      assignment.parentRating = rating;
      assignment.parentFeedback = feedback;
    } else if (ratingSource === 'STUDENT') {
      assignment.studentRating = rating;
      assignment.studentFeedback = feedback;
    }

    await assignment.save();

    res.json({
      message: 'Rating submitted successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mentor ratings
exports.getRatings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.userId });

    const assignments = await MentorshipAssignment.find({ mentorId: mentor._id });

    const ratings = {
      parentRatings: assignments
        .filter(a => a.parentRating)
        .map(a => a.parentRating),
      studentRatings: assignments
        .filter(a => a.studentRating)
        .map(a => a.studentRating)
    };

    const avgParentRating = ratings.parentRatings.length > 0
      ? (ratings.parentRatings.reduce((a, b) => a + b, 0) / ratings.parentRatings.length).toFixed(2)
      : null;

    const avgStudentRating = ratings.studentRatings.length > 0
      ? (ratings.studentRatings.reduce((a, b) => a + b, 0) / ratings.studentRatings.length).toFixed(2)
      : null;

    res.json({
      mentorId: mentor._id,
      parentRating: {
        average: avgParentRating,
        count: ratings.parentRatings.length
      },
      studentRating: {
        average: avgStudentRating,
        count: ratings.studentRatings.length
      },
      totalAssignments: assignments.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get critical alerts for mentor's students (REFUSE grades)
exports.getCriticalAlerts = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.userId });

    const assignments = await MentorshipAssignment.find({
      mentorId: mentor._id,
      isActive: true
    }).distinct('studentId');

    const alerts = await Alert.find({ studentId: { $in: assignments }, isRead: false })
      .populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 });

    const criticalGrades = await Grade.find({
      studentId: { $in: assignments },
      status: 'REFUSE'
    }).populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      alerts: {
        count: alerts.length,
        records: alerts
      },
      failingGrades: {
        count: criticalGrades.length,
        records: criticalGrades
      }
    });
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