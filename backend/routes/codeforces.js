const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/codeforcesController');

// Get contest history with filters
router.get('/:id/contests', codeforcesController.getContestHistory);

// Get problem solving data with filters
router.get('/:id/problems', codeforcesController.getProblemData);

// Update sync schedule
router.put('/sync-schedule', codeforcesController.updateSyncSchedule);

// Trigger manual sync
router.post('/sync-now', codeforcesController.triggerManualSync);

module.exports = router;