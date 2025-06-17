const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Students
export const fetchStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`);
  return handleResponse(response);
};

export const fetchStudentProfile = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`);
  return handleResponse(response);
};

export const addStudent = async (studentData) => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  return handleResponse(response);
};

export const updateStudent = async (id, studentData) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  return handleResponse(response);
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const exportToCSV = async () => {
  const response = await fetch(`${API_BASE_URL}/students/download/csv`);
  if (!response.ok) {
    throw new Error('Failed to export data');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'students.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Codeforces
export const fetchContestHistory = async (studentId, days) => {
  const response = await fetch(
    `${API_BASE_URL}/codeforces/${studentId}/contests?days=${days}`
  );
  return handleResponse(response);
};

export const fetchProblemData = async (studentId, days) => {
  const response = await fetch(
    `${API_BASE_URL}/codeforces/${studentId}/problems?days=${days}`
  );
  return handleResponse(response);
};

export const updateSyncSchedule = async (schedule) => {
  const response = await fetch(`${API_BASE_URL}/codeforces/sync-schedule`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ schedule }),
  });
  return handleResponse(response);
};

export const triggerManualSync = async () => {
  const response = await fetch(`${API_BASE_URL}/codeforces/sync-now`, {
    method: 'POST',
  });
  return handleResponse(response);
};