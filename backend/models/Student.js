const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  codeforcesHandle: {
    type: String,
    required: true,
    unique: true
  },
  currentRating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  emailRemindersEnabled: {
    type: Boolean,
    default: true
  },
  reminderCount: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date
  }
});

module.exports = mongoose.model('Student', StudentSchema);