const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true },
    date: { type: String, required: true }, 
    dayOfWeek: { type: String, required: true }, 
    period: { type: Number, required: true },
    status: { type: String, default: 'Present' }, 
    start: { type: String, required: false }, // Make this optional
    end: { type: String, required: false },   // Make this optional
  },
  { timestamps: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
