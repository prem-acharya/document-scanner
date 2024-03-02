import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Camera from "./Components/Camera";
import CropImage from "./Components/CropImage";
import Upload from "./Components/Upload";
import Dashboard from "./Components/Dashboard";

function App() {
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = (imageDataUrl) => {
    setCapturedImage(imageDataUrl);
  };

  const handleUploadSuccess = (downloadUrl) => {
    // console.log("Image uploaded successfully:", downloadUrl);
    alert("Image uploaded successfully!");
  };

  const handleUploadError = (error) => {
    // console.error("Error uploading image:", error);
    alert("Failed to upload image.");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Camera onCapture={handleCapture} />} />
          <Route path="/crop" element={<CropImage imageDataUrl={capturedImage} />} />
          <Route path="/upload" element={<Upload imageDataUrl={capturedImage} onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
