import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "./StaffNav";

const Staff = () => {
  const [staffDetails, setStaffDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("stafftoken");
    const email = localStorage.getItem("staffemail");

    if (!token || !email) {
      navigate("/staffsignin");
      return;
    }

    setLoading(true);


    axios
      .get(`/api/staffauth/staffusers?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStaffDetails(response.data);
      })
      .catch((err) => console.error("Error fetching staff details:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!staffDetails?.firstName) return;

    const token = localStorage.getItem("stafftoken");

    setLoading(true);


    axios
      .get("/api/students/students", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const filteredStudents = response.data.filter(
          (student) => student.classIncharge === staffDetails.firstName
        );
        setStudents(filteredStudents);
      })
      .catch((err) => console.error("Error fetching student data:", err))
      .finally(() => setLoading(false));
  }, [staffDetails?.firstName]);


  const handleStudentClick = (studentId) => {
    navigate(`/studentdetails/${studentId}`);
  };

  
  const handleAddStudentClick = () => {
    navigate(`/addstudent/${staffDetails?.firstName} ${staffDetails?.lastName} `);
  };

  const handleRemove = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;

    try {
      await axios.delete(`/api/students/students/${studentId}`);
      setStudents((prev) => prev.filter((student) => student._id !== studentId));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };


  const filteredStudents = students.filter((student) =>
    student.rollNumber.toString().includes(searchQuery)
  );

  return (
    <div>
      <Nav />
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h2>Welcome, {staffDetails?.firstName || "Staff"}!</h2>
            <p>Email: {staffDetails?.email}</p>
            <p>Department: {staffDetails?.Department}</p>
          </div>

          <div className="col-12 mt-4">
            <h4>Students in Your Class</h4>

           
            <div className="mb-3 d-flex justify-content-between">
              <div className="d-flex">
                <label htmlFor="searchRollNumber" className="form-label me-2">
                  Search by Roll Number
                </label>
                <input
                  type="text"
                  id="searchRollNumber"
                  className="form-control"
                  placeholder="Enter Roll Number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleAddStudentClick}
              >
                Add Student
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr
                        key={student._id || index}
                        onClick={() => handleStudentClick(student._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{index + 1}</td>
                        <td>{student.firstName}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.course}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(student._id);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No students assigned to you.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
