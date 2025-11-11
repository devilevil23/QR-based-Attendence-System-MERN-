require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const staffauthRoutes = require('./routes/staffauthRoutes');
const { scheduleAbsenteeCheck } = require('./controllers/attendanceScheduler');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/staffauth', staffauthRoutes);
app.use('/departments', departmentRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'qr-codes')));
app.use('/profile', express.static(path.join(__dirname, 'uploads', 'temp')));

app.get('/', (req, res) => {
  res.status(200).send("server is running");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
