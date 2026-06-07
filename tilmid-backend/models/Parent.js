const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phoneNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Parent', ParentSchema);