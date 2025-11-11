const express = require('express');
const Department = require('../model/Department');

const router = express.Router();

// Fetch all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

router.get('/:departmentName/courses', async (req, res) => {
  try {
    const department = await Department.findOne({ name: req.params.departmentName });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ courses: department.courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});


// Add a new department
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const newDepartment = new Department({ name, courses: [] });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding department' });
  }
});

// Add a course to a department
router.post('/:departmentId/courses', async (req, res) => {
  const { departmentId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Course name is required' });
  }

  try {
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.courses.push({ name });
    await department.save();

    res.status(201).json(department.courses[department.courses.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Error adding course' });
  }
});

// Delete a department
router.delete('/:departmentId', async (req, res) => {
  const { departmentId } = req.params;

  try {
    const department = await Department.findByIdAndDelete(departmentId);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting department' });
  }
});

// Delete a course from a department
router.delete('/:departmentId/courses/:courseId', async (req, res) => {
  const { departmentId, courseId } = req.params;

  try {
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const courseIndex = department.courses.findIndex(
      (course) => course._id.toString() === courseId
    );

    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }

    department.courses.splice(courseIndex, 1);
    await department.save();

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

module.exports = router;
