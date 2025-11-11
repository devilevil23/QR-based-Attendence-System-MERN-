import React, { useState } from 'react';
import QRScanner from './QRCodeScanner'; 
const ParentComponent = () => {
  const [scanResult, setScanResult] = useState('');

 
  const handleScan = (scannedRollNumber) => {
    console.log('Scanned Roll Number:', scannedRollNumber);
    setScanResult(scannedRollNumber); 
  };

  return (
    <div>
   
      <QRScanner onScan={handleScan} />
   
    </div>
  );
};

export default ParentComponent;
