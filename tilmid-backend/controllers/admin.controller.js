const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Mentor = require('../models/Mentor');
const Admin = require('../models/Admin');
const Grade = require('../models/Grade');
const Alert = require('../models/Alert');
const MentorshipAssignment = require('../models/MentorshipAssignment');
const MonthlyReport = require('../models/MonthlyReport');

// Get KPIs for dashboard
exports.getKPIs = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalTeachers = await User.countDocuments({ role: 'TEACHER' });
    const totalMentors = await User.countDocuments({ role: 'MENTOR' });
    const totalParents = await User.countDocuments({ role: 'PARENT' });
    const pendingReports = await MonthlyReport.countDocuments({ status: 'PENDING' });
    const actionRequiredReports = await MonthlyReport.countDocuments({ status: 'ACTION_REQUIRED' });
    const totalAlerts = await Alert.countDocuments({ isRead: false });
    const totalGrades = await Grade.countDocuments();

    res.json({
      totalStudents,
      totalTeachers,
      totalMentors,
      totalParents,
      pendingReports,
      actionRequiredReports,
      totalAlerts,
      totalGrades,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unassigned students (no mentor)
exports.getUnassignedStudents = async (req, res) => {
  try {
    const allStudents = await Student.find()
      .populate('userId', 'email firstName lastName')
      .populate('classId', 'name level');

    const assignedStudentIds = await MentorshipAssignment.find({ isActive: true })
      .distinct('studentId');

    const unassignedStudents = allStudents.filter(
      student => !assignedStudentIds.includes(student._id.toString())
    );

    res.json({
      count: unassignedStudents.length,
      students: unassignedStudents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign mentor to student
exports.assignMentor = async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;

    if (!mentorId || !studentId) {
      return res.status(400).json({ message: 'mentorId and studentId required' });
    }

    // Check if already assigned
    const existing = await MentorshipAssignment.findOne({ mentorId, studentId, isActive: true });
    if (existing) {
      return res.status(400).json({ message: 'Student already assigned to this mentor' });
    }

    // Check mentor caseload
    const mentor = await Mentor.findById(mentorId);
    if (mentor.currentCaseload >= mentor.maxCaseload) {
      return res.status(400).json({ message: 'Mentor caseload is full' });
    }

    // Create assignment
    const assignment = new MentorshipAssignment({
      mentorId,
      studentId,
      isActive: true
    });

    await assignment.save();

    // Update mentor caseload
    mentor.currentCaseload += 1;
    await mentor.save();

    res.json({
      message: 'Mentor assigned successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mentor workload
exports.getMentorWorkload = async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('userId', 'firstName lastName email');

    const mentorWorkload = mentors.map(mentor => ({
      mentorId: mentor._id,
      mentorName: `${mentor.userId.firstName} ${mentor.userId.lastName}`,
      email: mentor.userId.email,
      currentCaseload: mentor.currentCaseload,
      maxCaseload: mentor.maxCaseload,
      loadPercentage: Math.round((mentor.currentCaseload / mentor.maxCaseload) * 100),
      status: mentor.currentCaseload >= mentor.maxCaseload ? 'FULL' : 
              mentor.currentCaseload > (mentor.maxCaseload * 0.8) ? 'NEAR_CAPACITY' : 'OK',
      availableSlots: mentor.maxCaseload - mentor.currentCaseload
    }));

    res.json(mentorWorkload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending reports for moderation
exports.getPendingReports = async (req, res) => {
  try {
    const reports = await MonthlyReport.find({ status: { $in: ['PENDING', 'ACTION_REQUIRED'] } })
      .populate('studentId', 'firstName lastName')
      .populate('teacherId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve report
exports.approveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { notes } = req.body;

    const report = await MonthlyReport.findByIdAndUpdate(
      reportId,
      {
        status: 'APPROVED',
        reviewedById: req.userId,
        reviewNotes: notes,
        reviewedAt: new Date()
      },
      { new: true }
    );

    res.json({ message: 'Report approved', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject report
exports.rejectReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { notes } = req.body;

    const report = await MonthlyReport.findByIdAndUpdate(
      reportId,
      {
        status: 'ACTION_REQUIRED',
        reviewedById: req.userId,
        reviewNotes: notes,
        reviewedAt: new Date()
      },
      { new: true }
    );

    res.json({ message: 'Report flagged for action', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('userId', 'email firstName lastName isActive');

    res.json({
      count: teachers.length,
      teachers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mentors
exports.getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('userId', 'email firstName lastName isActive');

    res.json({
      count: mentors.length,
      mentors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'email firstName lastName')
      .populate('classId', 'name level');

    res.json({
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};