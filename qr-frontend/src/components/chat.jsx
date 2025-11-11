import React, { useRef, useEffect, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/library";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [barcodeResult, setBarcodeResult] = useState("");

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        codeReader.decodeFromVideoElement(videoRef.current).then((result) => {
          if (result) {
            setBarcodeResult(result.text);
          }
        });
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initCamera();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <video ref={videoRef} width="100%" />
      <p>
        <strong>Scanned Code:</strong> {barcodeResult || "No barcode detected"}
      </p>
    </div>
  );
};

export default BarcodeScanner;
