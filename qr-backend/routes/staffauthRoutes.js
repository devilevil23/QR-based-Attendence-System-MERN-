const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const StaffUser = require('../model/StaffUser');
const router = express.Router();
const { JWT_SECRET } = process.env;


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    req.user = user;
    next();
  });
}


router.post('/add', async (req, res) => {
  const { firstName, lastName, Dob, Department, Role, email, password } = req.body;
console.log(req.body)
  try {
    const existingUser = await StaffUser.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

   
    const newUser = new StaffUser({ firstName, lastName, Dob, Department, Role, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await StaffUser.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });


    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Sign-In successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
});


router.get('/staffuser', async (req, res) => {
  try {
    const staff = await StaffUser.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

router.get('/staffuser/:id', async (req, res) => {
  try {
    const staff = await StaffUser.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff member', error: error.message });
  }
});


router.post('/staffuser', async (req, res) => {
  try {
    const { firstName, lastName, email, password, Department, Role, Dob } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new StaffUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      Department,
      Role,
      Dob,
    });

    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(500).json({ message: 'Error adding staff member', error: err.message });
  }
});


router.put('/staffuser/:id', async (req, res) => {
  try {
    const updatedStaff = await StaffUser.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json(updatedStaff);
  } catch (err) {
    res.status(500).json({ message: 'Error updating staff member', error: err.message });
  }
});



router.delete('/staffuser/:id', async (req, res) => {
  try {
    const deletedStaff = await StaffUser.findByIdAndDelete(req.params.id);

    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting staff member', error: err.message });
  }
});


router.get('/staffusers', authenticateToken, async (req, res) => {
  const email = req.query.email;

  try {
    const staff = await StaffUser.findOne({ email });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

module.exports = router;
