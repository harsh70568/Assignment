import React, { useState, useEffect } from 'react';
import { fetchContestHistory } from '../services/api';
import RatingGraph from './RatingGraph';
import './ContestHistory.css';

const ContestHistory = ({ studentId, daysFilter, initialData }) => {
  const [contests, setContests] = useState([]);
  const [ratingGraph, setRatingGraph] = useState([]);
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
      const data = await fetchContestHistory(studentId, daysFilter);
      processData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading contest history:', error);
      setLoading(false);
    }
  };

  const processData = (data) => {
    setContests(data.contestHistory ?? []);
    setRatingGraph(data.ratingGraph ?? []);
  };

  if (loading) {
    return <div className="loading">Loading contest history...</div>;
  }

  return (
    <div className="contest-history">
      <div className="graph-container">
        <h3>Rating Progress</h3>
        <RatingGraph data={ratingGraph} />
      </div>

      <div className="contests-list">
        <h3>Contests ({contests.length})</h3>
        {contests.length > 0 ? (
          <table className="contests-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Contest</th>
                <th>Rank</th>
                <th>Rating Change</th>
                <th>New Rating</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest.contestId}>
                  <td>{new Date(contest.date).toLocaleDateString()}</td>
                  <td>
                    <a
                      href={`https://codeforces.com/contest/${contest.contestId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contest.contestName}
                    </a>
                  </td>
                  <td>{contest.rank}</td>
                  <td className={contest.ratingChange >= 0 ? 'positive' : 'negative'}>
                    {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                  </td>
                  <td>{contest.newRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No contests found in this period.</p>
        )}
      </div>
    </div>
  );
};

export default ContestHistory;