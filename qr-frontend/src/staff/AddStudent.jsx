import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from './StaffNav';
import QRCode from 'react-qr-code';

const StudentForm = () => {
  const { stafffirstName } = useParams(); 
  const rollNumber = null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    rollNumber: '',
    classIncharge: stafffirstName,
    department: '',
    course: '',
    gender: '',
    dob: '',
    motherName: '',
    fatherName: '',
    aadhaarNumber: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
   const [departments, setDepartments] = useState([]);
     const [courses, setCourses] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const qrCodeRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("stafftoken");
    const email = localStorage.getItem("staffemail");

    if (!token || !email) {
      navigate("/staffsignin");
    }
  }, [navigate]);


  useEffect(() => {
    if (rollNumber) {
      axios.get(`/api/students/${rollNumber}`)
        .then((response) => {
          setFormData(response.data); 
        })
        .catch((error) => {
          console.error('Error fetching student data:', error);
          setErrorMessage('Error fetching student data. Please try again.');
        });
    }
  }, [rollNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rollNumber) {
      try {
        const response = await axios.post('/api/students/student', formData);
        if (response.status === 201) {
          setQrCodeUrl(`/api/qrcodes/${formData.rollNumber}`); 
          await saveQRCode();
       
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            rollNumber: '',
            classIncharge: '',
            department: '',
            course: '',
            gender: '',
            dob: '',
            motherName: '',
            fatherName: '',
            aadhaarNumber: '',
          });
          setErrorMessage(''); 
        }
      } catch (error) {
        console.error('Error creating student:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to create student. Please try again.');
      }
    } else {
      setErrorMessage('Please enter a valid roll number');
    }
  };


  const saveQRCode = async () => {
    const svg = qrCodeRef.current?.querySelector('svg');
    if (!svg) {
      alert('QR Code not found. Please generate it first.');
      return;
    }
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
  
   
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
  

      const pngUrl = canvas.toDataURL('image/png');
      
    
      if (!formData.rollNumber) {
        alert('Roll number is missing');
        return;
      }
  
      try {
        const response = await axios.put('/api/students/save-qr-code', {
          rollNumber: formData.rollNumber,
          qrCodeImage: pngUrl,
        });
  
        if (response.status === 200) {
          alert('QR Code saved successfully!');
        } else {
          alert(`Failed to save QR Code: ${response.data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error saving QR Code:', error.response || error.message);
        alert(`An error occurred: ${error.response ? error.response.data.message : error.message}`);
      }
    };
  
    img.src = url;
  };


  useEffect(() => {
    // Fetch departments from the API
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrorMessage('Error fetching departments. Please try again later.');
      }
    };
    fetchDepartments();
  }, []);

  const handleDepartmentChange = async (e) => {
    const selectedDepartment = e.target.value;
  
    // Update form state immediately
    setFormData(prevData => ({ ...prevData, department: selectedDepartment, course: '' }));
  
    // Reset courses if no department is selected
    if (!selectedDepartment) {
      setCourses([]);
      return;
    }
  
    try {
      // Fetch courses for the selected department
      const response = await axios.get(`/api/departments/${selectedDepartment}/courses`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setErrorMessage('Error fetching courses for the selected department.');
    }
  };
  

  const downloadQRCode = () => {
    const svg = qrCodeRef.current?.querySelector('svg');
    if (!svg) {
      alert('QR Code not found. Please generate it first.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `QRCode_${formData.rollNumber}.png`;
      link.click();
    };

    img.src = url;
  };

  return (
    <div>
      <Nav />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Student Form</h2>
        {errorMessage && (
          <div className="alert alert-danger text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row ">
            <div className="col-md-6">
          
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control input-uppercase"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control input-uppercase"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="text"
                  id="phone"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  type="text"
                  id="state"
                  className="form-control input-uppercase"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zip" className="form-label">Zip Code</label>
                <input
                  type="text"
                  id="zip"
                  className="form-control"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
             
            </div>
            <div className="col-md-6">
           
              <div className="mb-3">
                <label htmlFor="classIncharge" className="form-label">Class Incharge</label>
                <input
                  type="text"
                  id="classIncharge"
                  className="form-control input-uppercase"
                  name="classIncharge"
                  value={stafffirstName}
                  placeholder={stafffirstName}
                  readOnly
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <select
                  id="department"
                  className="form-select"
                  name="department"
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="course" className="form-label">Course</label>
                <select
                  id="course"
                  className="form-select"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  disabled={!formData.department}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  className="form-control input-uppercase"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="motherName" className="form-label">Mother's Name</label>
                <input
                  type="text"
                  id="motherName"
                  className="form-control input-uppercase"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fatherName" className="form-label">Father's Name</label>
                <input
                  type="text"
                  id="fatherName"
                  className="form-control input-uppercase"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                />
              </div>

            
              <div className="mb-3">
                <label htmlFor="aadhaarNumber" className="form-label">Aadhaar Number</label>
                <input
                  type="text"
                  id="aadhaarNumber"
                  className="form-control"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="rollNumber" className="form-label">Roll Number</label>
                <input
                  type="text"
                  id="rollNumber"
                  className="form-control"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        
       
        {formData.rollNumber && (
          <div className="mt-4 text-center">
            <h3>QR Code for Roll Number {formData.rollNumber}</h3>
            <div ref={qrCodeRef}>
              <QRCode value={formData.rollNumber} size={256} />
            </div>
            <div className="mt-3">
             
              <button className="btn btn-info ms-3" onClick={downloadQRCode}>
                Download QR Code
              </button>
            </div>
          </div>
          )}
            <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>

       
        
      </div>
    </div>
  );
};

export default StudentForm;
