const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Mentor = require('../models/Mentor');
const Parent = require('../models/Parent');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email exists' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ email, passwordHash, role, firstName, lastName });
    await user.save();
    
    if (role === 'STUDENT') {
      const student = new Student({ userId: user._id, studentCode: `STU-${user._id}` });
      await student.save();
    } else if (role === 'TEACHER') {
      const teacher = new Teacher({ userId: user._id });
      await teacher.save();
    } else if (role === 'MENTOR') {
      const mentor = new Mentor({ userId: user._id });
      await mentor.save();
    } else if (role === 'PARENT') {
      const parent = new Parent({ userId: user._id });
      await parent.save();
    } else if (role === 'ADMIN') {
      const admin = new Admin({ userId: user._id, schoolName: 'TILMID' });
      await admin.save();
    }
    
    res.json({ message: 'Registered', userId: user._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;