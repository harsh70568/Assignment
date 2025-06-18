import React, { useState, useEffect } from 'react';
import { fetchProblemData } from '../services/api';
import RatingDistribution from './RatingDistribution';
import Heatmap from './Heatmap';
import './ProblemStats.css';

const ProblemStats = ({ studentId, daysFilter, initialData, heatmapData }) => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
      processData(initialData);
    } else {
      loadData();
    }
  }, [studentId, daysFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchProblemData(studentId, daysFilter);
      processData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading problem data:', error);
      setLoading(false);
    }
  };

  const processData = (data) => {
    setProblems(data.problemsSolved ?? []);
    setStats(data.stats ?? []);
    setRatingDistribution(data.ratingDistribution ?? []);
    setHeatmap(data.submissionHeatmap ?? []);
  };

  if (loading) {
    return <div className="loading">Loading problem data...</div>;
  }

  return (
    <div className="problem-stats">
      <div className="stats-summary">
        <h3>Problem Solving Stats</h3>
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalSolved}</div>
              <div className="stat-label">Problems Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.averageRating}</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.averagePerDay}</div>
              <div className="stat-label">Problems/Day</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.mostDifficultProblem ? stats.mostDifficultProblem.problemRating : '-'}
              </div>
              <div className="stat-label">Hardest Problem</div>
              {stats.mostDifficultProblem && (
                <div className="problem-link">
                  <a
                    href={`https://codeforces.com/problemset/problem/${stats.mostDifficultProblem.contestId}/${stats.mostDifficultProblem.problemIndex}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stats.mostDifficultProblem.problemName}
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No stats available.</p>
        )}
      </div>

      <div className="rating-distribution">
        <h3>Problems Solved by Rating</h3>
        {ratingDistribution.length > 0 ? (
          <RatingDistribution data={ratingDistribution} />
        ) : (
          <p>No rating distribution data available.</p>
        )}
      </div>

      <div className="submission-heatmap">
        <h3>Submission Activity</h3>
        {heatmap.length > 0 ? (
          <Heatmap data={heatmap} days={daysFilter} />
        ) : (
          <p>No submission data available.</p>
        )}
      </div>

      <div className="problems-list">
        <h3>Solved Problems ({problems.length})</h3>
        {problems.length > 0 ? (
          <table className="problems-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Problem</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={index}>
                  <td>{new Date(problem.submissionDate).toLocaleDateString()}</td>
                  <td>
                    <a
                      href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.problemIndex}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {problem.problemName}
                    </a>
                  </td>
                  <td>{problem.problemRating || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No problems solved in this period.</p>
        )}
      </div>
    </div>
  );
};

export default ProblemStats;