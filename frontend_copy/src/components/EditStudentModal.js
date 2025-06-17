import React, { useState, useEffect } from 'react';
import { updateStudent } from '../services/api';
import './Modal.css';

const EditStudentModal = ({ student, onClose, onStudentUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        codeforcesHandle: student.codeforcesHandle
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedStudent = await updateStudent(student._id, formData);
      onStudentUpdated(updatedStudent);
    } catch (err) {
      setError(err.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Student</h3>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Codeforces Handle</label>
              <input
                type="text"
                name="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;