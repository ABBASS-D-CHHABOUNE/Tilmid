const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const MonthlyReport = require('../models/MonthlyReport');

// Get teacher profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.userId })
      .populate('userId', 'email firstName lastName');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all classes (optional - for now returning empty)
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json({
      count: classes.length,
      classes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get students in a class
exports.getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.find({ classId })
      .populate('userId', 'email firstName lastName');

    res.json({
      classId,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status, notes } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: 'studentId, date, and status required' });
    }

    if (!['PRESENT', 'ABSENT', 'LATE'].includes(status)) {
      return res.status(400).json({ message: 'Status must be PRESENT, ABSENT, or LATE' });
    }

    const teacher = await Teacher.findOne({ userId: req.userId });

    const attendance = new Attendance({
      studentId,
      classId,
      date: new Date(date),
      status,
      recordedBy: teacher._id,
      notes
    });

    await attendance.save();

    res.json({
      message: 'Attendance recorded',
      attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance for a student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ studentId })
      .populate('studentId', 'firstName lastName')
      .sort({ date: -1 });

    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'PRESENT').length,
      absent: attendance.filter(a => a.status === 'ABSENT').length,
      late: attendance.filter(a => a.status === 'LATE').length
    };

    res.json({
      studentId,
      stats,
      records: attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance for a class
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;

    const attendance = await Attendance.find({ classId })
      .populate('studentId', 'firstName lastName')
      .sort({ date: -1 });

    res.json({
      classId,
      count: attendance.length,
      records: attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit monthly report
exports.submitMonthlyReport = async (req, res) => {
  try {
    const { studentId, month, year, content } = req.body;

    if (!studentId || !month || !year || !content) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const teacher = await Teacher.findOne({ userId: req.userId });

    const report = new MonthlyReport({
      studentId,
      teacherId: teacher._id,
      month,
      year,
      content,
      status: 'PENDING'
    });

    await report.save();

    res.json({
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get submitted reports by teacher
exports.getMyReports = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.userId });

    const reports = await MonthlyReport.find({ teacherId: teacher._id })
      .populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get grade entry dashboard (grades teacher has entered)
exports.getMyGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ teacherId: req.userId })
      .populate('studentId', 'firstName lastName')
      .sort({ createdAt: -1 });

    const stats = {
      total: grades.length,
      admis: grades.filter(g => g.status === 'ADMIS').length,
      refuse: grades.filter(g => g.status === 'REFUSE').length
    };

    res.json({
      stats,
      grades
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};