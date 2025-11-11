

const express = require('express');

const { markAttendance,getAttendanceByRollNumber } = require('../controllers/attendanceController');
const router = express.Router();


router.post('/', markAttendance);

router.get('/attendance/:rollNumber', getAttendanceByRollNumber);
module.exports = router;
