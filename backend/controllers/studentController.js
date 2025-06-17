const Student = require('../models/Student');
const CodeforcesData = require('../models/CodeforcesData');
const { generateCSV } = require('../services/csvService');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    codeforcesHandle: req.body.codeforcesHandle
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if CF handle changed
    const cfHandleChanged = req.body.codeforcesHandle && 
                           req.body.codeforcesHandle !== student.codeforcesHandle;

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.phone = req.body.phone || student.phone;
    
    if (cfHandleChanged) {
      student.codeforcesHandle = req.body.codeforcesHandle;
      student.currentRating = 0;
      student.maxRating = 0;
      student.lastUpdated = new Date();
    }

    const updatedStudent = await student.save();
    
    if (cfHandleChanged) {
      // Trigger immediate sync
      const { syncCodeforcesDataForStudent } = require('../services/codeforcesService');
      await syncCodeforcesDataForStudent(updatedStudent._id);
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await student.remove();
    await CodeforcesData.deleteOne({ student: req.params.id });
    
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student profile data
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const codeforcesData = await CodeforcesData.findOne({ student: req.params.id });
    
    res.json({
      student,
      codeforcesData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download students as CSV
exports.downloadStudentsCSV = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    const csv = await generateCSV(students);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update email reminders setting
exports.updateEmailReminders = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.emailRemindersEnabled = req.body.enabled;
    await student.save();
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};