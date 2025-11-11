import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './AdminNav';
const apiUrl = import.meta.env.VITE_API_URL;


const StaffAddForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    Dob: '',
    Department: '',
    Role: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
   const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      await axios.post('/api/Staffauth/add', formData);

    
      navigate('/stafflist');
    } catch (err) {
   
      setError(err.response?.data?.message || 'Error adding staff');
    }
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
    setFormData({ ...formData, Department: selectedDepartment, course: '' });

    if (selectedDepartment) {
      try {
        const response = await axios.get(`/api/departments/${selectedDepartment}/courses`);
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrorMessage('Error fetching courses for selected department.');
      }
    } else {
      setCourses([]);
    }
  };

  return (
    <div>
      <Nav />
      <div className="container mt-5">
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
          <h1 className="mb-4">Staff Add Form</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
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
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Dob" className="form-label">Date of Birth</label>
            <input
              type="date"
              id="Dob"
              name="Dob"
              className="form-control"
              value={formData.Dob}
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
                  value={formData.Department}
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
            <label htmlFor="Role" className="form-label">Role</label>
            <input
              type="text"
              id="Role"
              name="Role"
              className="form-control"
              value={formData.Role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default StaffAddForm;
