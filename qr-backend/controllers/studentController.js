// controllers/studentController.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const Student = require('../model/studentModel');


const getStudentDetails = async (req, res) => {
  try {
    const { rollNumbers } = req.body; 

    if (!Array.isArray(rollNumbers) || rollNumbers.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of roll numbers.' });
    }

    const students = await Student.find({ rollNumber: { $in: rollNumbers } });
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the provided roll numbers.' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student details.', error: error.message });
  }
};


const createStudent = async (req, res) => {
  try {
    const { rollNumber } = req.body;
   

  
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this roll number already exists.' });
    }

    
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student created successfully!', student });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating student.', error: error.message });
  }
};


const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching students.', error: error.message });
  }
};


const getStudentByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;
  
    const student = await Student.findOne({ rollNumber });
  
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student.', error: error.message });
  }
};

const UpdateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

const DeleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByIdAndDelete(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
  
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting student' });
  }
  
};


const getStudentById = async (req, res) => {
  const studentId = req.params.id;

 
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  try {
  
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const SaveQrCode = async (req, res) => {
  try {
    const { rollNumber, qrCodeImage } = req.body;


    if (!rollNumber || !qrCodeImage) {
      return res.status(400).json({ message: 'Roll number and QR code image are required' });
    }

   
    console.log(`Received request to save QR code for roll number: ${rollNumber}`);

    const dirPath = path.join(__dirname, '../uploads/qr-codes');
    console.log(`Directory path: ${dirPath}`);

    
    await fs.promises.mkdir(dirPath, { recursive: true });

    
    const fileName = `${rollNumber}-qr-code.png`;
    const filePath = path.join(dirPath, fileName);


    const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);
    if (fileExists) {
      return res.status(400).json({ message: 'QR Code already exists for this roll number' });
    }

   
    const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, '');
    if (!base64Data || base64Data.length === 0) {
      return res.status(400).json({ message: 'Invalid base64 data' });
    }

   
    await fs.promises.writeFile(filePath, base64Data, 'base64');

  
    const student = await Student.findOneAndUpdate(
      { rollNumber },
      { qrCode: fileName },
      { new: true }
    );

    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

   
    res.status(200).json({ message: 'QR Code saved successfully!' });
  } catch (error) {
    console.error('Error saving QR Code:', error);
   
    res.status(500).json({ message: 'Error saving QR code. Please try again.', error: error.message });
  }
};
const SaveProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { rollNumber } = req.body;

    if (!rollNumber) {
      return res.status(400).json({ message: 'Roll number is required.' });
    }

    const profilePic = req.file; 
    const fileName = `${rollNumber}-profile${path.extname(profilePic.originalname)}`;

    const Stu = await Student.findOne({ rollNumber }); 
    if (!Stu) {
      return res.status(404).json({ message: 'Student not found.' });
    }


    Stu.profilePic = fileName; 
    await Stu.save(); 
    res.status(200).json({
      message: 'Profile picture uploaded successfully!',
      profilePic: fileName, 
    });
  } catch (error) {
    console.error('Error during profile picture upload:', error);

    res.status(500).json({
      message: 'Error uploading the profile picture.',
      error: error.message,
    });
  }
};

const Signin = async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    // Find the student by roll number
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Validate password (compare with stored DOB)
    const formattedDOB = new Date(student.dob).toISOString().split("T")[0]; // Format DOB as YYYY-MM-DD
    if (password !== formattedDOB) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { rollNumber: student.rollNumber, name: `${student.firstName} ${student.lastName}` },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, studentDetails: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  createStudent,
  getAllStudents,
  getStudentByRollNumber,
  UpdateStudent,
  DeleteStudent,
  getStudentById, 
  SaveQrCode,
  SaveProfilePicture,
  Signin,

}
