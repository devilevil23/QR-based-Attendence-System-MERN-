import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Admin/AdminNav';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DepartmentCourseManager = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (err) {
        setError('Error fetching departments.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!departmentName.trim()) {
      alert('Department name cannot be empty.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        '/api/departments',
        { name: departmentName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDepartments([...departments, { ...response.data, courses: [] }]);
      setDepartmentName('');
    } catch (err) {
      setError('Error adding department.');
    }
  };

  const handleAddCourse = async (departmentId) => {
    if (!courseName.trim()) {
      alert('Course name cannot be empty.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `/api/departments/${departmentId}/courses`,
        { name: courseName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDepartments(
        departments.map((dept) =>
          dept._id === departmentId
            ? { ...dept, courses: [...dept.courses, response.data] }
            : dept
        )
      );
      setCourseName('');
    } catch (err) {
      setError('Error adding course.');
    }
  };

  const handleRemoveDepartment = async (departmentId) => {
    if (!window.confirm('Are you sure you want to remove this department?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/departments/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(departments.filter((dept) => dept._id !== departmentId));
    } catch (err) {
      setError('Error removing department.');
    }
  };

  const handleRemoveCourse = async (departmentId, courseId) => {
    if (!window.confirm('Are you sure you want to remove this course?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/departments/${departmentId}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(
        departments.map((dept) =>
          dept._id === departmentId
            ? { ...dept, courses: dept.courses.filter((course) => course._id !== courseId) }
            : dept
        )
      );
    } catch (err) {
      setError('Error removing course.');
    }
  };

  const toggleDepartmentVisibility = (departmentId) => {
    setSelectedDepartmentId(selectedDepartmentId === departmentId ? null : departmentId);
  };

  return (
    <>
      <Nav />
      <div className="container-fluid">
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <h1>Department and Course Management</h1>

        <div className="mb-4">
          <h4>Add Department</h4>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter department name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddDepartment}>
            Add Department
          </button>
        </div>

        <div className="mt-4">
          <h4>Departments and Courses</h4>
          {departments.length === 0 ? (
            <p>No departments available.</p>
          ) : (
            <div className="accordion" id="departmentAccordion">
              {departments.map((dept) => (
                <div className="accordion-item" key={dept._id}>
                  <h2 className="accordion-header" id={`heading${dept._id}`}>
                    <button
                      className={`accordion-button ${
                        selectedDepartmentId === dept._id ? '' : 'collapsed'
                      }`}
                      type="button"
                      onClick={() => toggleDepartmentVisibility(dept._id)}
                    >
                      {dept.name}
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${
                      selectedDepartmentId === dept._id ? 'show' : ''
                    }`}
                    aria-labelledby={`heading${dept._id}`}
                  >
                    <div className="accordion-body">
                      <h5>Courses</h5>
                      {dept.courses.length > 0 ? (
                        <ul className="list-group">
                          {dept.courses.map((course) => (
                            <li key={course._id} className="list-group-item d-flex justify-content-between align-items-center">
                              {course.name}
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveCourse(dept._id, course._id)}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No courses available.</p>
                      )}
                      <div className="mt-3">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Enter course name"
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                        />
                        <button
                          className="btn btn-success"
                          onClick={() => handleAddCourse(dept._id)}
                        >
                          Add Course
                        </button>
                      </div>
                      <div className="text-end mt-3">
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveDepartment(dept._id)}
                        >
                          Remove Department
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DepartmentCourseManager;
