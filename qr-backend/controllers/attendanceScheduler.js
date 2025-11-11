require("dotenv").config();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Attendance = require("../model/attendanceModel");
const Student = require("../model/studentModel");

// Define periods
const periods = [
  { start: "09:20", end: "09:55", period: 1 },
  { start: "10:20", end: "10:55", period: 2 },
  { start: "11:20", end: "11:55", period: 3 },
  { start: "13:00", end: "13:30", period: 4 },
  { start: "14:10", end: "14:30", period: 5 },
  { start: "15:10", end: "15:30", period: 6 },
  { start: "16:00", end: "16:25", period: 7 },
];

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env file
    pass: process.env.EMAIL_PASS, // App password from .env file
  },
});

// Function to send attendance email to a student
const sendAttendanceEmail = async (student, attendanceRecords) => {
  if (!student.email) {
    console.log(`⚠️ No email found for student ${student.name}`);
    return;
  }

  const emailBody = `
    <h3>Attendance Report for ${student.name} (${student.rollNumber})</h3>
    <p>Date: ${new Date().toISOString().split("T")[0]}</p>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Period</th>
        <th>Status</th>
      </tr>
      ${attendanceRecords
        .map(
          (record) =>
            `<tr>
              <td>Period ${record.period}</td>
              <td>${record.status}</td>
            </tr>`
        )
        .join("")}
    </table>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: student.email,
    subject: `Daily Attendance Report for ${student.name}`,
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${student.email}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${student.email}:`, error);
  }
};

// Function to check and mark absentees, then send emails
const checkAndMarkAbsentees = async () => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const dayOfWeek = now.toLocaleString("en-us", { weekday: "long" });

  console.log(`[${new Date().toISOString()}] 🔍 Checking absentees...`);

  try {
    const students = await Student.find();

    for (const student of students) {
      let attendanceRecords = [];

      for (const { period } of periods) {
        let existingAttendance = await Attendance.findOne({
          rollNumber: student.rollNumber,
          date: today,
          period,
        });

        if (!existingAttendance) {
          existingAttendance = new Attendance({
            rollNumber: student.rollNumber,
            date: today,
            dayOfWeek,
            period,
            start: null,
            end: null,
            status: "Absent",
          });

          await existingAttendance.save();
        }

        attendanceRecords.push(existingAttendance);
      }

      // Send an email to each student
      await sendAttendanceEmail(student, attendanceRecords);
    }

    console.log(`[${new Date().toISOString()}] ✅ Absentee check completed.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error marking absentees:`, err);
  }
};

// Schedule task to run at 4:30 PM daily
cron.schedule("32 22 * * *", () => {
  console.log(`[${new Date().toISOString()}] 🕒 Running scheduled absentee check...`);
  checkAndMarkAbsentees();
});

module.exports = {
  checkAndMarkAbsentees,
};
