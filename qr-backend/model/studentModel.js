const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true },
    aadhaarNumber: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    fatherName: { type: String, required: true },
    motherName: { type: String, required:false  },
    email: { type: String, required: false},
    phone: { type: String, required: false },
    dob: { type: Date, required: false },
    address: { type: String, required: false },
    gender: { type: String, required: false },
    course: { type: String, required: false },
    department: { type: String, required: false },
    classIncharge: { type: String, required: true },
    qrCode: { type: String, required: false },
    profilePic:{ type: String, required: false },
  },
  { timestamps: true }
);

const Student = mongoose.model('Students', studentSchema);

module.exports = Student;
