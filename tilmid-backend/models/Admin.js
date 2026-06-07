const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  schoolName: String
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);