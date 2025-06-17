const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all students
router.get('/', studentController.getAllStudents);

// Create a new student
router.post('/', studentController.createStudent);

// Get student profile
router.get('/:id', studentController.getStudentProfile);

// Update a student
router.put('/:id', studentController.updateStudent);

// Delete a student
router.delete('/:id', studentController.deleteStudent);

// Download students as CSV
router.get('/download/csv', studentController.downloadStudentsCSV);

// Update email reminders setting
router.put('/:id/email-reminders', studentController.updateEmailReminders);

module.exports = router;