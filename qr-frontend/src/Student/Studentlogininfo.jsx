import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import Att from "../components/StuAttendance";
import { jsPDF } from "jspdf";

const StudentloginInfo = () => {
  const { id } = useParams(); // Get the 'id' from the route parameter
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) {
      navigate("/studentlogin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!id) {
      setError("Student ID not provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`/api/students/studentdetails/${id}`)
      .then((response) => {
        setStudentDetails(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching student details.");
        setLoading(false);
        console.error("Error fetching student details:", err);
      });
  }, [id]);

  const handleDownloadPDF = () => {
    if (!studentDetails) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Student Details for ${studentDetails.firstName} ${studentDetails.lastName}`, 14, 20);

    const studentInfo = [
      ["Name", `${studentDetails.firstName} ${studentDetails.lastName}`],
      ["Email", studentDetails.email || "N/A"],
      ["Roll Number", studentDetails.rollNumber || "N/A"],
      ["Phone", studentDetails.phone || "N/A"],
      ["Father's Name", studentDetails.fatherName || "N/A"],
      ["Mother's Name", studentDetails.motherName || "N/A"],
      ["Date of Birth", studentDetails.dob || "N/A"],
      ["Gender", studentDetails.gender || "N/A"],
      ["Stream", studentDetails.stream || "N/A"],
      ["Course", studentDetails.course || "N/A"],
      ["Address", studentDetails.address || "N/A"],
    ];

    studentInfo.forEach((info, index) => {
      doc.text(info[0], 14, 30 + index * 10);
      doc.text(info[1], 90, 30 + index * 10);
    });

    doc.save(`${studentDetails.firstName}_${studentDetails.lastName}_details.pdf`);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Student Details</h2>
      {studentDetails ? (
        <div className="card mt-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5>Name:</h5>
                <p>{`${studentDetails.firstName} ${studentDetails.lastName}`}</p>
                <h5>Email:</h5>
                <p>{studentDetails.email || "N/A"}</p>
                <h5>Roll Number:</h5>
                <p>{studentDetails.rollNumber || "N/A"}</p>
                <h5>Phone:</h5>
                <p>{studentDetails.phone || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <img
                  src={`/api/profile/${studentDetails.profilePic}`}
                  alt="Profile"
                  className="img-fluid rounded p-4"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
                <img
                  src={`/api/uploads/${studentDetails.qrCode}`}
                  alt="QR Code"
                  className="img-fluid rounded p-4"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No student details found.</p>
      )}
      <Att rollNumber={studentDetails?.rollNumber} />
    </div>
  );
};

export default StudentloginInfo;
