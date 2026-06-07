const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: String,
  academicYear: String
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);