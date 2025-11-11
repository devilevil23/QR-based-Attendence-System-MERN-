const Attendance = require('../model/attendanceModel');
const Student = require('../model/studentModel');    

const getCurrentPeriod = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const periods = [
    { start: "09:20", end: "09:55", period: 1 },
    { start: "10:20", end: "10:55", period: 2 },
    { start: "11:20", end: "11:55", period: 3 },
    { start: "13:00", end: "13:30", period: 4 },
    { start: "14:10", end: "14:30", period: 5 },
    { start: "15:10", end: "15:30", period: 6 },
    { start: "16:00", end: "16:25", period: 7 }
  ];

  const nowTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  for (const { start, end, period } of periods) {
    if (nowTime >= start && nowTime <= end) {
      return { period, start, end };
    }
  }

  return null; 
};


const markAttendance = async (req, res) => {
  const { rollNumber, period } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: 'Roll number is required' });
  }

  // Define working hours: 9:00 AM to 4:30 PM
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Check if the current time is outside working hours (before 9:00 AM or after 4:30 PM)
  if (currentHour < 9 || (currentHour === 9 && currentMinute < 0) || currentHour > 16 || (currentHour === 16 && currentMinute > 30)) {
    return res.status(400).json({ message: 'Out of working hours. Attendance can only be marked between 9:00 AM and 4:30 PM.' });
  }

  // Get the current period, defaulting to the one passed in the request or using the helper function
  const currentPeriod = period || getCurrentPeriod();

  if (!currentPeriod) {
    return res.status(400).json({ message: 'Time out for registering attendance for this Period ' });
  }

  try {
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0]; 
    const dayOfWeek = now.toLocaleString('en-us', { weekday: 'long' });

    const existingAttendance = await Attendance.findOne({
      rollNumber,
      date: today,
      period: currentPeriod.period,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: `Attendance already marked for Period ${currentPeriod.period}` });
    }

    const newAttendance = new Attendance({
      rollNumber,
      date: today,
      dayOfWeek,
      period: currentPeriod.period,
      start: currentPeriod.start, 
      end: currentPeriod.end,  
    });

    await newAttendance.save(); 
    res.status(200).json({ message: `Attendance marked successfully for Period ${currentPeriod.period}` });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error marking attendance', error: err.message });
  }
};


const getAttendanceByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
  
    const attendanceData = await Attendance.find({ rollNumber }).sort({ date: 1, period: 1 }); 
    if (!attendanceData || attendanceData.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this student.' });
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ message: 'Error fetching attendance data', error: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceByRollNumber,
};









