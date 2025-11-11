import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const beepSound = new Audio("/assets/beep.mp3"); 

    const startScanning = async () => {
      try {
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Browser does not support media devices.");
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevice = devices.find((device) => device.kind === "videoinput");

        if (!videoDevice) {
          throw new Error("No camera devices found.");
        }

        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: videoDevice.deviceId,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        videoRef.current.srcObject = stream;
        videoStreamRef.current = stream;

        // Start QR code scanning
        codeReader.current.decodeFromVideoDevice(videoDevice.deviceId, videoRef.current, (result, error) => {
          if (result) {
            beepSound.play().catch((err) => console.error("Error playing beep sound:", err));
            handleQRCodeDetected(result.getText());
          } else if (error instanceof NotFoundException) {
            console.log("No QR code detected in the current frame.");
          } else if (error) {
            console.error("Error during QR code scanning:", error);
          }
        });
      } catch (err) {
        console.error("Error starting the scanner:", err);
        setErrorMessage(err.message || "Unable to start the scanner.");
      }
    };

    const handleQRCodeDetected = async (qrCodeText) => {
      if (isScanning) return;
      setIsScanning(true);

      try {
        await fetchStudentDetails(qrCodeText);
        await markAttendance(qrCodeText);
      } finally {
        setTimeout(() => setIsScanning(false), 1500); 
      }
    };

    const fetchStudentDetails = async (rollNumber) => {
      try {
        const response = await axios.get(`/api/students/${rollNumber}`);
        setStudentDetails(response.data);
        setErrorMessage("");
      } catch (err) {
        setStudentDetails(null);
        setErrorMessage(err.response?.data?.message || "Student not found.");
      }
    };

    const markAttendance = async (rollNumber) => {
      try {
        const response = await axios.post(`/api/attendance`, { rollNumber });
        setAttendanceStatus(response.data?.message || `Attendance marked successfully for roll number: ${rollNumber}`);
      } catch (err) {
        setAttendanceStatus(err.response?.data?.message || "Failed to mark attendance.");
      }
    };

    startScanning();

    return () => {
      
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      codeReader.current.reset();
    };
  }, [isScanning]);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <h2 className="text-center">Scan QR Code</h2>
            <video
              ref={videoRef}
              className="w-100 border border-secondary rounded"
              autoPlay
              playsInline
            />
          </div>
          <div className="col-md-6 mb-4">
            <h2 className="text-center">Student Details</h2>
            {studentDetails ? (
              <div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <img
                      src={`/api/profile/${studentDetails.profilePic}`}
                      alt={`Profile of ${studentDetails.firstName}`}
                      className="img-fluid rounded"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <img
                      src={`/api/uploads/${studentDetails.qrCode}`}
                      alt={`QR code of ${studentDetails.firstName}`}
                      className="img-fluid rounded"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </div>
                </div>
                
                <ul className="list-group">
                  <li className="list-group-item">Roll Number: {studentDetails.rollNumber}</li>
                  <li className="list-group-item">Name: {studentDetails.firstName} {studentDetails.lastName}</li>
                  <li className="list-group-item">Email: {studentDetails.email}</li>
                  <li className="list-group-item">Phone: {studentDetails.phone}</li>
                  <li className="list-group-item">Course: {studentDetails.course}</li>
                  <li className="list-group-item">Department: {studentDetails.department}</li>
                  <li className="list-group-item">Class Incharge: {studentDetails.classIncharge}</li>
                </ul>
              </div>
            ) : (
              <div className="alert alert-secondary text-center">Scan a QR code to display student details.</div>
            )}
            {attendanceStatus && <div className="alert alert-info mt-3">{attendanceStatus}</div>}
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
