const axios = require('axios');
const Student = require('../models/Student');
const CodeforcesData = require('../models/CodeforcesData');

// Fetch data from Codeforces API
const fetchCodeforcesData = async (handle) => {
  try {
    const [userInfoRes, userStatusRes, userRatingRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${handle}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`)
    ]);

    return {
      userInfo: userInfoRes.data.result[0],
      userStatus: userStatusRes.data.result,
      userRating: userRatingRes.data.result
    };
  } catch (err) {
    console.error(`Error fetching data for ${handle}:`, err.message);
    throw err;
  }
};

// Process and store Codeforces data for a student
const processCodeforcesData = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student not found');

  const { userInfo, userStatus, userRating } = await fetchCodeforcesData(student.codeforcesHandle);

  // Update student ratings
  student.currentRating = userInfo.rating || 0;
  student.maxRating = userInfo.maxRating || 0;
  student.lastUpdated = new Date();
  await student.save();

  // Process contest history
  const contestHistory = userRating.map(contest => ({
    contestId: contest.contestId,
    contestName: contest.contestName,
    rank: contest.rank,
    ratingChange: contest.newRating - contest.oldRating,
    oldRating: contest.oldRating,
    newRating: contest.newRating,
    date: new Date(contest.ratingUpdateTimeSeconds * 1000)
  }));

  // Process solved problems
  const solvedProblems = userStatus
    .filter(submission => submission.verdict === 'OK')
    .map(submission => ({
      contestId: submission.problem.contestId,
      problemIndex: submission.problem.index,
      problemName: submission.problem.name,
      problemRating: submission.problem.rating || 0,
      submissionDate: new Date(submission.creationTimeSeconds * 1000)
    }));

  // Process submission heatmap
  const heatmapData = {};
  userStatus.forEach(submission => {
    const date = new Date(submission.creationTimeSeconds * 1000);
    const dateStr = date.toISOString().split('T')[0];
    heatmapData[dateStr] = (heatmapData[dateStr] || 0) + 1;
  });

  const submissionHeatmap = Object.entries(heatmapData).map(([date, count]) => ({
    date: new Date(date),
    count
  }));

  // Update or create Codeforces data
  await CodeforcesData.findOneAndUpdate(
    { student: studentId },
    {
      student: studentId,
      contestHistory,
      problemsSolved: solvedProblems,
      submissionHeatmap,
      lastSynced: new Date()
    },
    { upsert: true, new: true }
  );

  return { student, lastSynced: new Date() };
};

// Sync data for a single student
const syncCodeforcesDataForStudent = async (studentId) => {
  try {
    const result = await processCodeforcesData(studentId);
    
    // Update last activity date
    const codeforcesData = await CodeforcesData.findOne({ student: studentId });
    const lastActivity = codeforcesData.submissionHeatmap
      .map(item => item.date)
      .sort((a, b) => b - a)[0];
    
    if (lastActivity) {
      await Student.findByIdAndUpdate(studentId, { lastActivityDate: lastActivity });
    }
    
    return result;
  } catch (err) {
    console.error(`Error syncing data for student ${studentId}:`, err);
    throw err;
  }
};

// Sync data for all students
const syncCodeforcesData = async () => {
  try {
    const students = await Student.find();
    const results = [];
    
    for (const student of students) {
      try {
        const result = await syncCodeforcesDataForStudent(student._id);
        results.push(result);
      } catch (err) {
        console.error(`Error syncing data for student ${student._id}:`, err);
        results.push({ error: err.message, student: student._id });
      }
    }
    
    return results;
  } catch (err) {
    console.error('Error in syncCodeforcesData:', err);
    throw err;
  }
};

// Get filtered contest history
const getFilteredContestHistory = async (studentId, days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const codeforcesData = await CodeforcesData.findOne({ student: studentId });
  if (!codeforcesData) return { contestHistory: [], ratingGraph: [] };

  const filteredHistory = codeforcesData.contestHistory
    .filter(contest => contest.date >= cutoffDate)
    .sort((a, b) => a.date - b.date);

  const ratingGraph = filteredHistory.map(contest => ({
    date: contest.date,
    rating: contest.newRating
  }));

  return {
    contestHistory: filteredHistory,
    ratingGraph
  };
};

// Get filtered problem solving data
const getFilteredProblemData = async (studentId, days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const codeforcesData = await CodeforcesData.findOne({ student: studentId });
  if (!codeforcesData) return {
    problemsSolved: [],
    stats: {},
    ratingDistribution: [],
    submissionHeatmap: []
  };

  const filteredProblems = codeforcesData.problemsSolved
    .filter(problem => problem.submissionDate >= cutoffDate);

  // Calculate stats
  const solvedCount = filteredProblems.length;
  const daysCount = days;
  const problemsPerDay = solvedCount / daysCount;
  
  const ratings = filteredProblems.map(p => p.problemRating).filter(r => r > 0);
  const avgRating = ratings.length > 0 ? 
    Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
  
  const maxRatingProblem = filteredProblems.length > 0 ?
    filteredProblems.reduce((max, problem) => 
      problem.problemRating > max.problemRating ? problem : max
    ) : null;

  // Calculate rating distribution
  const ratingDistribution = [];
  for (let rating = 800; rating <= 3500; rating += 100) {
    const count = filteredProblems.filter(p => 
      p.problemRating >= rating && p.problemRating < rating + 100
    ).length;
    if (count > 0) {
      ratingDistribution.push({
        ratingRange: `${rating}-${rating + 99}`,
        count
      });
    }
  }

  // Filter heatmap data
  const filteredHeatmap = codeforcesData.submissionHeatmap
    .filter(item => item.date >= cutoffDate);

  return {
    problemsSolved: filteredProblems,
    stats: {
      totalSolved: solvedCount,
      averageRating: avgRating,
      averagePerDay: problemsPerDay.toFixed(2),
      mostDifficultProblem: maxRatingProblem
    },
    ratingDistribution,
    submissionHeatmap: filteredHeatmap
  };
};

module.exports = {
  fetchCodeforcesData,
  processCodeforcesData,
  syncCodeforcesData,
  syncCodeforcesDataForStudent,
  getFilteredContestHistory,
  getFilteredProblemData
};