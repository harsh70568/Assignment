const nodemailer = require('nodemailer');
const Student = require('../models/Student');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Check for inactive students and send reminders
const checkInactiveStudents = async () => {
  try {
    const inactiveThreshold = new Date();
    inactiveThreshold.setDate(inactiveThreshold.getDate() - 7);

    const students = await Student.find({
      emailRemindersEnabled: true,
      $or: [
        { lastActivityDate: { $lt: inactiveThreshold } },
        { lastActivityDate: { $exists: false } }
      ]
    });

    for (const student of students) {
      try {
        await sendReminderEmail(student);
        student.reminderCount += 1;
        await student.save();
      } catch (err) {
        console.error(`Error sending email to ${student.email}:`, err);
      }
    }

    return { sent: students.length };
  } catch (err) {
    console.error('Error in checkInactiveStudents:', err);
    throw err;
  }
};

// Send reminder email to a student
const sendReminderEmail = async (student) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: student.email,
    subject: 'Keep Up Your Coding Practice!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Hello ${student.name},</h2>
        <p>We noticed you haven't made any submissions on Codeforces in the last 7 days.</p>
        <p>Regular practice is key to improving your programming skills. Why not solve a problem today?</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://codeforces.com/problemset" 
             style="background-color: #3498db; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
            Solve Problems Now
          </a>
        </p>
        <p>Your current rating: <strong>${student.currentRating}</strong></p>
        <p>Your max rating: <strong>${student.maxRating}</strong></p>
        <p>Keep up the good work!</p>
        <hr>
        <p style="font-size: 12px; color: #7f8c8d;">
          You're receiving this email because you're enrolled in our progress tracking system.
          <a href="${process.env.APP_URL}/profile/${student._id}/settings">Update your email preferences</a>.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  checkInactiveStudents,
  sendReminderEmail
};