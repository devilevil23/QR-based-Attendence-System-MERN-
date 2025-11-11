import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const QRCodeGenerator = ({ text }) => {
  const qrCodeRef = useRef(null);
  console.log(text);


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
    const size = 200;

 
    canvas.width = size;
    canvas.height = size;

  
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${text || 'qrcode'}.png`;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
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
      try {
        const response = await axios.put('/api/students/save-qr-code', {
          rollNumber: text,
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-12 text-center border p-4 shadow-sm rounded">
          <h2 className="mb-4">QR Code Generator</h2>

          <div className="mb-4" ref={qrCodeRef}>
            <QRCode value={text || 'N/A'} size={200} />
          </div>

          <button className="btn btn-primary w-100 mt-3" onClick={downloadQRCode}>
            Download QR Code
          </button>

          <button className="btn btn-success w-100 mt-3" onClick={saveQRCode}>
            Save QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
