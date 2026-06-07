const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['ADMIN', 'TEACHER', 'MENTOR', 'PARENT', 'STUDENT'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  locale: { type: String, enum: ['ar', 'fr', 'en', 'de'], default: 'fr' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);