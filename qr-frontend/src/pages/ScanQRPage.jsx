import React from 'react';
import QRCodeScanner from '../components/QRCodeScanner';

const ScanQRPage = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-12 text-center">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Scan QR Code</h2>
              <p className="card-text mb-4">Please point your camera at a QR code to scan it.</p>
              
              <QRCodeScanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;