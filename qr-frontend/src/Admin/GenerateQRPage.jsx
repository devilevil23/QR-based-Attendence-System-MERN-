import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCodeGenerator from '../Admin/QRCodeGenerator'; 
import 'bootstrap/dist/css/bootstrap.min.css';



const GenerateQRPage = () => {
  const { rollNumber } = useParams(); 
  const [text, setText] = useState(''); 
 
  useEffect(() => {
    if (rollNumber) {
      setText(`Roll Number: ${rollNumber}`);
    }
  }, [rollNumber]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-12 text-center">
          <h2 className="mb-4">Generate QR Code</h2>
          <p className="lead mb-4">
            Scan the QR code below for the student roll number.
          </p>
          <QRCodeGenerator text={text} rollNumber={rollNumber} />
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
