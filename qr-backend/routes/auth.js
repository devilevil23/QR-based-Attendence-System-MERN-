const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const router = express.Router();
const { JWT_SECRET } = process.env;


router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  try {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

  
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Sign-In successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
});

module.exports = router;
