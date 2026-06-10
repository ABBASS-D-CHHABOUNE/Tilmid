const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const gradeRoutes = require('./routes/grade.routes');
const studentRoutes = require('./routes/student.routes');
const adminRoutes = require('./routes/admin.routes');
const teacherRoutes = require('./routes/teacher.routes');
const mentorRoutes = require('./routes/mentor.routes');
const parentRoutes = require('./routes/parent.routes');
const assignmentRoutes = require('./routes/assignment.routes')

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/assignments', assignmentRoutes)



app.get('/', (req, res) => {
  res.json({ message: 'TILMID Backend Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});