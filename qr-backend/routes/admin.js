const express = require('express');
const router = express.Router();
const Student = require('../model/studentModel'); // Adjust path as needed
const StaffUser = require('../model/StaffUser'); // Adjust path as needed
const Department = require('../model/Department'); // Adjust path as needed


router.get('/stats', async (req, res) => {
    try {
      // Fetch counts from the database
      const studentCount = await Student.countDocuments();
      const staffCount = await StaffUser.countDocuments();
      const departmentCount = await Department.countDocuments();

      res.json({ students: studentCount, staff: staffCount, departments: departmentCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
  });
  
  module.exports = router;
  
