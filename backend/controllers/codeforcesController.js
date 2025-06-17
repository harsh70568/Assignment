const Student = require('../models/Student');
const CodeforcesData = require('../models/CodeforcesData');
const { getFilteredContestHistory, getFilteredProblemData } = require('../services/codeforcesService');

// Get contest history with filters
exports.getContestHistory = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const days = parseInt(req.query.days) || 30;
    const data = await getFilteredContestHistory(student._id, days);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get problem solving data with filters
exports.getProblemData = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const days = parseInt(req.query.days) || 30;
    const data = await getFilteredProblemData(student._id, days);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update sync schedule
exports.updateSyncSchedule = async (req, res) => {
  try {
    // In a real app, you'd want to validate and sanitize the cron expression
    process.env.CF_SYNC_SCHEDULE = req.body.schedule;
    
    // Restart cron jobs with new schedule
    const { initializeCronJobs } = require('../../config/cron');
    initializeCronJobs();
    
    res.json({ message: 'Sync schedule updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manually trigger sync for all students
exports.triggerManualSync = async (req, res) => {
  try {
    const { syncCodeforcesData } = require('../services/codeforcesService');
    await syncCodeforcesData();
    
    res.json({ message: 'Manual sync initiated for all students' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};