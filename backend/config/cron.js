const cron = require('node-cron');
const { syncCodeforcesData } = require('../services/codeforcesService');
const { checkInactiveStudents } = require('../services/emailService');

const initializeCronJobs = () => {
  // Default schedule: daily at 2 AM
  const syncSchedule = process.env.CF_SYNC_SCHEDULE || '0 2 * * *';
  
  cron.schedule(syncSchedule, async () => {
    console.log('Running scheduled Codeforces data sync...');
    await syncCodeforcesData();
    await checkInactiveStudents();
  });
  
  console.log(`Cron jobs initialized. Codeforces sync scheduled: ${syncSchedule}`);
};

module.exports = { initializeCronJobs };