const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose'); // Assuming MongoDB is being used

// MongoDB Model for Student
const Student = require('../model/studentModel'); // Adjust the path to your Student model

// Directory for uploads
const dirPath = path.join(__dirname, '../uploads/temp');

// Ensure the directory exists
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirPath);
  },
  filename: async (req, file, cb) => {
    try {
      const rollNumber = req.body.rollNumber; // Roll number from request body
      if (!rollNumber) {
        return cb(new Error('Roll number is required'));
      }

      // Fetch student record from the database
      const student = await Student.findOne({ rollNumber });
      if (student && student.profilePic) {
        const oldFilePath = path.join(dirPath, student.profilePic);

        // Delete existing file if it exists
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Generate new file name
      const extname = path.extname(file.originalname).toLowerCase();
      const newFileName = `${rollNumber}-profile${extname}`;

      // Update student's profile image in the database
      await Student.updateOne(
        { rollNumber },
        { $set: { profileImage: newFileName } }
      );

      cb(null, newFileName); // Save new file
    } catch (err) {
      cb(err); // Handle errors
    }
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPG, JPEG, and PNG are allowed'), false);
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});

module.exports = upload;
