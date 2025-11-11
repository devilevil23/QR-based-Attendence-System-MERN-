import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Nav from "./AdminNav";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Att from '../components/StuAttendance'
import { jsPDF } from 'jspdf';

const StudentInfo = () => {
  const { id } = useParams(); 
  const [studentDetails, setStudentDetails] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showImageModal, setShowImageModal] = useState(false); 
  const [updatedDetails, setUpdatedDetails] = useState({}); 
  const [profileImage, setProfileImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const navigate = useNavigate();
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
      .get(`/api/students/studentdetails/${id}`)
      .then((response) => {
        setStudentDetails(response.data);
        setUpdatedDetails(response.data); 
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching student details.");
        setLoading(false);
        console.error("Error fetching student details:", err);
      });
  }, [id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  
  const handleUpdate = () => {
    if (!updatedDetails.firstName || !updatedDetails.email) {
      alert("First Name and Email are required fields.");
      return;
    }

    axios
      .put(`/api/students/students/${id}`, updatedDetails)
      .then(() => {
        setStudentDetails(updatedDetails); 
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error updating student details:", err);
        alert("Error updating details. Please try again.");
      });
  };

 
  const handleImageUpload = async () => {
   
    const rollNumber = studentDetails?.rollNumber;
    if (!rollNumber) {
      setUploadStatus('Roll number is required.');
      return;
    }
  
    if (!profileImage) {
      setUploadStatus('Please select a profile picture to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('rollNumber', rollNumber);
    formData.append('profilePic', profileImage);
  
    try {
      setUploadStatus('Uploading...');
      
      const response = await axios.post('/api/students/saveprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      
      if (response.status === 200) {
        setUploadStatus(`Profile picture uploaded successfully: ${response.data.profilePic}`);
       
        setStudentDetails((prevDetails) => ({
          ...prevDetails,
          profilePic: response.data.profilePic,
        }));
       
        setShowImageModal(false);
      } else {
 
        setUploadStatus(`Failed to upload profile picture: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
  
     
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      setUploadStatus(`Error: ${errorMessage}`);
    }
  };
  const handleDownloadIDCard = () => {
    const doc = new jsPDF();
  
   
    const cardWidth = 70; 
    const cardHeight = 100; 
  
   
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, cardWidth, cardHeight, "F"); 
    

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 255);
    doc.text("Your Institution Name", 40, 18, { align: "center", maxWidth: cardWidth  -10 });
  
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); 
    doc.text("STUDENT ID CARD", 40, 25, { align: "center", maxWidth: cardWidth - 10 });
  
   
    if (studentDetails.profilePic) {
      const imgUrl = `/api/profile/${studentDetails.profilePic}`;
      doc.addImage(imgUrl, "JPEG", 12, 30, 30, 40); 
    }
  
   
    doc.setFontSize(10);
    doc.text(`Name: ${studentDetails.firstName} ${studentDetails.lastName}`, 12, 75);
    doc.text(`Roll Number: ${studentDetails.rollNumber}`, 12, 80);
    doc.text(`Course: ${studentDetails.course}`, 12, 85);
    doc.text(`Department: ${studentDetails.department}`, 12, 90);

    const dateTime = studentDetails.dob;
    const dateOnly = new Date(dateTime).toISOString().split('T')[0];
    
    doc.text(`DOB: ${dateOnly}`, 12, 95);
    
    doc.rect(50, 30, 25, 25);
  
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100); 
    doc.text("Institution Name", 20, 105);
    doc.text("www.institutionwebsite.com", 20, 110);
  
    
    doc.addPage();
    doc.setFillColor(240, 240, 240); 
    doc.rect(10, 10, cardWidth, cardHeight, "F"); 
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); 
    doc.text("IMPORTANT INFORMATION", 12, 20);
  
   
    doc.setFontSize(10);
    doc.text("1. This card must be carried at all times.", 12, 30);
    doc.text("2. Report loss immediately to the institution.", 12, 35);
    doc.text("3. Tampering with the card is prohibited.", 12, 40);
  

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Institution Address: 123, Main Street, City", 12, 95);
    doc.text("Phone: +123-456-7890 | Email: info@institution.com", 12, 100);
  
   
    doc.save(`${studentDetails.firstName}_${studentDetails.lastName}_IDCard.pdf`);
  };
  const handleDownloadQRCode = () => {
    const qrCodeUrl = `/api/uploads/${studentDetails.qrCode}`;
  
   
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${studentDetails.firstName}_${studentDetails.lastName}_QRCode.png`; 
    link.click();
  };
  
  
  
 const handleDownloadPDF = () => {
     const doc = new jsPDF();
     const dateTime = studentDetails.dob;
     const dateOnly = dateTime.split("T")[0];
     console.log(dateOnly);  
     
     doc.setFontSize(16);
     doc.text(`Student Details for ${studentDetails.firstName} ${studentDetails.lastName}`, 14, 20);
     doc.setFontSize(12);
   
     
     const studentInfo = [
       ['Name', `${studentDetails.firstName} ${studentDetails.lastName}`],
       ['Email', studentDetails.email],
       ['Roll Number', studentDetails.rollNumber],
       ['Phone', studentDetails.phone],
       ['Father\'s Name', studentDetails.fatherName],
       ['Mother\'s Name', studentDetails.motherName],
       ['Date of Birth', dateOnly],
       ['Gender', studentDetails.gender],
       ['Department', studentDetails.department],
       ['Course', studentDetails.course],
       ['Address', studentDetails.address]
     ];
   
     
     studentInfo.forEach((info, index) => {
       doc.text(info[0], 14, 30 + index * 10);
       doc.text(info[1], 90, 30 + index * 10);
     });
   
     
     if (studentDetails.profilePic) {
       const imageUrl = `/api/profile/${studentDetails.profilePic}`;
       const imgWidth = 40; 
       const imgHeight = 40; 
       const xPos = 14; 
       const yPos = 30 + studentInfo.length * 10 + 10; 
       doc.addImage(imageUrl, 'JPEG', xPos, yPos, imgWidth, imgHeight);
     }
   
     
     if (studentDetails.qrCode) {
       const qrCodeUrl = `/api/uploads/${studentDetails.qrCode}`;
       const qrWidth = 40; 
       const qrHeight = 40; 
       const qrXPos = 80; 
       const qrYPos = 30 + studentInfo.length * 10 + 10; 
       doc.addImage(qrCodeUrl, 'JPEG', qrXPos, qrYPos, qrWidth, qrHeight);
     }
   

     doc.save(`${studentDetails.firstName}_${studentDetails.lastName}_details.pdf`);
   };


  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
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
        <h2 className="mb-4 text-center">Student Details</h2>
        {studentDetails ? (
          <div className="card">
            <div className="card-body">
            <div className="mt-4">
              <button
                className="btn btn-primary m-1"
                onClick={() => setShowEditModal(true)}
              >
                Edit Details
              </button>
              
              <button
                className="btn btn-success ml-2 m-1"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
              <button
    className="btn btn-primary m-1"
    onClick={handleDownloadIDCard}
  >
    Download ID Card
  </button>
            </div>
           
              <div className="row">
                <div className="col-md-6">
                  <h5 className="card-title">Name:</h5>
                  <p className="card-text">
                    {studentDetails.firstName} {studentDetails.lastName}
                  </p>
                  <h5 className="card-title">Email:</h5>
                  <p className="card-text">{studentDetails.email}</p>
                  <h5 className="card-title">Roll Number:</h5>
                  <p className="card-text">{studentDetails.rollNumber}</p>
                  <h5 className="card-title">Phone:</h5>
                  <p className="card-text">{studentDetails.phone}</p>
                </div>
                <div className="col-md-6 text-center">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <img
                      src={`/api/profile/${studentDetails.profilePic}`}
                      alt={`profile of ${studentDetails.firstName}`}
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
                  <div className="col-md-6">
                  <img
                      src={`/api/uploads/${studentDetails.qrCode}`}
                      alt={`QR code of ${studentDetails.firstName}`}
                      className="img-fluid rounded"
                      style={{ width: "200px", height: "200px" }}
                    />
                     <div className="mt-3"> 
                  <button
                    className="btn btn-primary ml-2 m-1"
                    onClick={handleDownloadQRCode}
                  >
                Downloaded
                    </button>
                      </div>
                  </div>
                  
                
                </div>
</div>

                
              </div>
            </div>
           
             <Att rollNumber={studentDetails.rollNumber} />
          </div>
        ) : (
          <p className="text-center mt-4">Student details not found.</p>
        )}
      </div>
    

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={updatedDetails.firstName || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={updatedDetails.lastName || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedDetails.email || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="text"
                name="rollNumber"
                value={updatedDetails.rollNumber || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Aadhaar Number</Form.Label>
              <Form.Control
                type="text"
                name="aadhaarNumber"
                value={updatedDetails.aadhaarNumber || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={updatedDetails.phone || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={updatedDetails.dob || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                name="fatherName"
                value={updatedDetails.fatherName || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mother's Name</Form.Label>
              <Form.Control
                type="text"
                name="motherName"
                value={updatedDetails.motherName || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={updatedDetails.gender || ""}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={updatedDetails.department || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                name="course"
                value={updatedDetails.course || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class In-charge</Form.Label>
              <Form.Control
                type="text"
                name="classIncharge"
                value={updatedDetails.classIncharge || ""}
                onChange={handleInputChange}
                
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={updatedDetails.address || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* Profile Image Upload */}
          
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Image Upload Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Choose an Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Upload Image
          </Button>
        </Modal.Footer>
      </Modal>

      
    </div>
  );
};

export default StudentInfo
