import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudents, deleteStudent, exportToCSV } from '../services/api';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import { ThemeContext } from '../contexts/ThemeContext';
import './StudentTable.css';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading students:', error);
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(student => student._id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportToCSV();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  return (
    <div className={`student-table-container ${theme}`}>
      <div className="table-header">
        <h2>Student Progress Management</h2>
        <div className="actions">
          <button onClick={() => setShowAddModal(true)} className="btn-add">
            Add Student
          </button>
          <button onClick={handleExport} className="btn-export">
            Export to CSV
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Codeforces Handle</th>
              <th>Current Rating</th>
              <th>Max Rating</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone || '-'}</td>
                <td>
                  <a 
                    href={`https://codeforces.com/profile/${student.codeforcesHandle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {student.codeforcesHandle}
                  </a>
                </td>
                <td className="rating-cell">{student.currentRating}</td>
                <td className="rating-cell">{student.maxRating}</td>
                <td>
                  {student.lastUpdated ? 
                    new Date(student.lastUpdated).toLocaleString() : 'Never'}
                </td>
                <td className="actions-cell">
                  <Link to={`/student/${student._id}`} className="btn-view">
                    View
                  </Link>
                  <button 
                    onClick={() => setEditingStudent(student)} 
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(student._id)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)}
          onStudentAdded={(newStudent) => {
            setStudents([...students, newStudent]);
            setShowAddModal(false);
          }}
        />
      )}

      {editingStudent && (
        <EditStudentModal 
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onStudentUpdated={(updatedStudent) => {
            setStudents(students.map(s => 
              s._id === updatedStudent._id ? updatedStudent : s
            ));
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentTable;