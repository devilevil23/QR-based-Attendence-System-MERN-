import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Nav from "./AdminNav";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { jsPDF } from "jspdf";

import EditStaffModal from "./EditStaffModal";


const StaffInfo = () => {
  const { id } = useParams();
  const [staffDetails, setStaffDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const navigate = useNavigate();
console.log(id)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`/api/staffauth/staffuser/${id}`)
      .then((response) => {
        setStaffDetails(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching staff details.");
        setLoading(false);
        console.error("Error fetching staff details:", err);
      });
  }, [id]);

  const handleUpdate = (updatedDetails) => {
    axios
      .put(`/api/staffauth/staffuser/${id}`, updatedDetails)
      .then(() => {
        setStaffDetails(updatedDetails);
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error updating staff details:", err);
        alert("Error updating details. Please try again.");
      });
  };

  const handleImageUpload = async () => {
    const rollNumber = staffDetails?.rollNumber;
    if (!rollNumber) {
      setUploadStatus("Roll number is required.");
      return;
    }

    if (!profileImage) {
      setUploadStatus("Please select a profile picture to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("rollNumber", rollNumber);
    formData.append("profilePic", profileImage);

    try {
      setUploadStatus("Uploading...");

      const response = await axios.post("/api/staff/saveprofile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setUploadStatus(`Profile picture uploaded successfully: ${response.data.profilePic}`);
        setStaffDetails((prevDetails) => ({
          ...prevDetails,
          profilePic: response.data.profilePic,
        }));
        setShowImageModal(false);
      } else {
        setUploadStatus(`Failed to upload profile picture: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      setUploadStatus(`Error: ${errorMessage}`);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Staff Details for ${staffDetails.firstName} ${staffDetails.lastName}`, 14, 20);
    doc.setFontSize(12);

    const staffInfo = [
      ["Name", `${staffDetails.firstName} ${staffDetails.lastName}`],
      ["Email", staffDetails.email],
      ["Roll Number", staffDetails.rollNumber],
      ["Phone", staffDetails.phone],
      ["Date of Birth", staffDetails.dob],
      ["Gender", staffDetails.gender],
      ["Department", staffDetails.department],
      ["Role", staffDetails.role],
    ];

    staffInfo.forEach((info, index) => {
      doc.text(info[0], 14, 30 + index * 10);
      doc.text(info[1], 90, 30 + index * 10);
    });

    if (staffDetails.profilePic) {
      const imageUrl = `/api/profile/${staffDetails.profilePic}`;
      doc.addImage(imageUrl, "JPEG", 14, 30 + staffInfo.length * 10 + 10, 40, 40);
    }

    doc.save(`${staffDetails.firstName}_${staffDetails.lastName}_details.pdf`);
  };

  const handleDownloadIDCard = () => {
    const doc = new jsPDF();
    const cardWidth = 70;
    const cardHeight = 100;

    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, cardWidth, cardHeight, "F");

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 255);
    doc.text("Institution Name", 40, 18, { align: "center", maxWidth: cardWidth - 10 });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("STAFF ID CARD", 40, 25, { align: "center", maxWidth: cardWidth - 10 });

    if (staffDetails.profilePic) {
      const imgUrl = `/api/profile/${staffDetails.profilePic}`;
      doc.addImage(imgUrl, "JPEG", 12, 30, 30, 40);
    }

    doc.setFontSize(10);
    doc.text(`Name: ${staffDetails.firstName} ${staffDetails.lastName}`, 12, 75);
    doc.text(`Roll Number: ${staffDetails.rollNumber}`, 12, 80);
    doc.text(`Department: ${staffDetails.department}`, 12, 85);
    doc.text(`Role: ${staffDetails.role}`, 12, 90);

    doc.rect(50, 30, 25, 25);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Institution Name", 20, 105);
    doc.text("www.institutionwebsite.com", 20, 110);

    doc.save(`${staffDetails.firstName}_${staffDetails.lastName}_IDCard.pdf`);
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
    <div>
      <Nav />
      <div className="container mt-5 mb-5">
        <h2 className="mb-4 text-center">Staff Details</h2>
        {staffDetails ? (
          <div className="card">
            <div className="card-body">
              <div className="mt-4">
                <button className="btn btn-primary m-1" onClick={() => setShowEditModal(true)}>
                  Edit Details
                </button>
                <button className="btn btn-success ml-2 m-1" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
                <button className="btn btn-primary m-1" onClick={handleDownloadIDCard}>
                  Download ID Card
                </button>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h5 className="card-title">Name:</h5>
                  <p className="card-text">
                    {staffDetails.firstName} {staffDetails.lastName}
                  </p>
                  <h5 className="card-title">Email:</h5>
                  <p className="card-text">{staffDetails.email}</p>
               
                  <h5 className="card-title">Phone:</h5>
                  <p className="card-text">{staffDetails.phone}</p>
                </div>
                <div className="col-md-6 text-center">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <img
                        src={`/api/profile/${staffDetails.profilePic}`}
                        alt={`profile of ${staffDetails.firstName}`}
                        className="img-fluid rounded"
                        style={{ width: "200px", height: "200px" }}
                      />
                      <div className="mt-3">
                        <button
                          className="btn btn-secondary ml-2 m-1"
                          onClick={() => setShowImageModal(true)}
                        >
                          Add Profile Picture
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center mt-4">Staff details not found.</p>
        )}
      </div>

      Edit Staff Modal
      <EditStaffModal
        show={showEditModal}
        staffDetails={staffDetails}
        handleUpdate={handleUpdate}
        onHide={() => setShowEditModal(false)}
      />

      {/* Profile Picture Upload Modal */}
      {/* <ProfilePictureUploadModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        handleImageUpload={handleImageUpload}
        setProfileImage={setProfileImage}
        uploadStatus={uploadStatus}
      /> */}
    </div>
  );
};

export default StaffInfo;
