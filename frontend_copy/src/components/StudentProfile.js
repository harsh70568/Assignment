import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudentProfile } from '../services/api';
import ContestHistory from './ContestHistory';
import ProblemStats from './ProblemStats';
import { ThemeContext } from '../contexts/ThemeContext';
import './StudentProfile.css';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contests');
  const [contestDaysFilter, setContestDaysFilter] = useState(30);
  const [problemDaysFilter, setProblemDaysFilter] = useState(30);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStudentProfile(id);
        setStudent(data.student);
        setCodeforcesData(data.codeforcesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading student profile:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading student profile...</div>;
  }

  if (!student) {
    return <div className="error">Student not found</div>;
  }

  return (
    <div className={`student-profile ${theme}`}>
      <div className="profile-header">
        <h2>{student.name}</h2>
        <div className="profile-meta">
          <div>
            <strong>Email:</strong> {student.email}
          </div>
          <div>
            <strong>Phone:</strong> {student.phone || '-'}
          </div>
          <div>
            <strong>Codeforces:</strong>{' '}
            <a 
              href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              {student.codeforcesHandle}
            </a>
          </div>
          <div>
            <strong>Current Rating:</strong> {student.currentRating}
          </div>
          <div>
            <strong>Max Rating:</strong> {student.maxRating}
          </div>
          <div>
            <strong>Last Updated:</strong>{' '}
            {student.lastUpdated ? new Date(student.lastUpdated).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'contests' ? 'active' : ''}
          onClick={() => setActiveTab('contests')}
        >
          Contest History
        </button>
        <button
          className={activeTab === 'problems' ? 'active' : ''}
          onClick={() => setActiveTab('problems')}
        >
          Problem Solving
        </button>
      </div>

      {activeTab === 'contests' && (
        <div className="tab-content">
          <div className="filter-controls">
            <label>Show contests from last:</label>
            <select
              value={contestDaysFilter}
              onChange={(e) => setContestDaysFilter(parseInt(e.target.value))}
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>365 days</option>
            </select>
          </div>
          <ContestHistory 
            studentId={id} 
            daysFilter={contestDaysFilter} 
            initialData={codeforcesData?.contestHistory}
          />
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="tab-content">
          <div className="filter-controls">
            <label>Show problems from last:</label>
            <select
              value={problemDaysFilter}
              onChange={(e) => setProblemDaysFilter(parseInt(e.target.value))}
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
          <ProblemStats 
            studentId={id} 
            daysFilter={problemDaysFilter} 
            initialData={codeforcesData?.problemsSolved}
            heatmapData={codeforcesData?.submissionHeatmap}
          />
        </div>
      )}
    </div>
  );
};

export default StudentProfile;