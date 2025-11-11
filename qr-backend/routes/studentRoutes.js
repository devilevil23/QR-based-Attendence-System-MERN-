const express = require('express');
const upload = require('../Middleware/multerConfig'); 
const {
  createStudent,
  getAllStudents,
  getStudentByRollNumber,
  UpdateStudent,
  DeleteStudent,
  getStudentById,
  SaveQrCode,
  SaveProfilePicture,
  Signin,
   
} = require('../controllers/studentController');

const router = express.Router();


router.post('/student', createStudent);


router.get('/students', getAllStudents);


router.get('/:rollNumber', getStudentByRollNumber);

router.put('/students/:id', UpdateStudent);


router.delete('/students/:id', DeleteStudent);

router.get("/studentdetails/:id", getStudentById);


router.put("/save-qr-code", SaveQrCode);

router.put("/saveprofile", SaveProfilePicture);

router.post('/saveprofile', upload.single('profilePic'), SaveProfilePicture);

router.post("/signin", Signin);


module.exports = router;
