const mongoose = require('mongoose');

// Course Schema (Embedded in Department)
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Department Schema
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [CourseSchema],  // Embedded Courses array
});

module.exports = mongoose.model('Department', DepartmentSchema);
