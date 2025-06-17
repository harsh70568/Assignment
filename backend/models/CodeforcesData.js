const mongoose = require('mongoose');

const ContestHistorySchema = new mongoose.Schema({
  contestId: Number,
  contestName: String,
  rank: Number,
  ratingChange: Number,
  oldRating: Number,
  newRating: Number,
  unsolvedProblems: [String],
  date: Date
});

const ProblemSolvedSchema = new mongoose.Schema({
  contestId: Number,
  problemIndex: String,
  problemName: String,
  problemRating: Number,
  submissionDate: Date
});

const SubmissionHeatmapSchema = new mongoose.Schema({
  date: Date,
  count: Number
});

const CodeforcesDataSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  contestHistory: [ContestHistorySchema],
  problemsSolved: [ProblemSolvedSchema],
  submissionHeatmap: [SubmissionHeatmapSchema],
  lastSynced: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeforcesData', CodeforcesDataSchema);