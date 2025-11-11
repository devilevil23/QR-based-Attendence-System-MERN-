import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './AdminNav';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students/students');
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin'); 
    }
  }, [navigate]);

  const filteredStudents = students.filter((student) =>
    student.rollNumber.toString().includes(searchQuery)
  );

  const handleAddStudent = () => {
    navigate('/adminstudentform');
  };

  const handleRemove = async (studentId, e) => {
    e.stopPropagation();

   
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this student? This action cannot be undone.'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/api/students/students/${studentId}`);
      setStudents((prev) => prev.filter((student) => student._id !== studentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting student');
    }
  };

  const handleStudentClick = (studentId) => {
    navigate(`/studentinfo/${studentId}`);
  };

  return (
    <div>
      <Nav />
      <div className="container-fluid">
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <h1>Student List</h1>

        <div className="d-flex justify-content-between mb-3">
          <div className="w-75">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Roll Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="btn btn-success ml-3"
            onClick={handleAddStudent}
          >
            Add New Student
          </button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Dpartment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student._id}
                onClick={() => handleStudentClick(student._id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{student.rollNumber}</td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.course}</td>
                <td>{student.department}</td>
                <td>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={(e) => handleRemove(student._id, e)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
