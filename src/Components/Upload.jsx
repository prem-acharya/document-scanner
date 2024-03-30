import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage, db } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = ({ imageDataUrl, onUploadSuccess, onUploadError }) => {
  const [fileName, setFileName] = useState("");
  const [fileNameError, setFileNameError] = useState("");
  const navigate = useNavigate();

  const validateFileName = () => {
    if (!fileName.trim()) {
      setFileNameError("File name cannot be empty");
      return false;
    }
    setFileNameError("");
    return true;
  };

  const uploadImage = async () => {
    if (!validateFileName()) {
      return;
    }

    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const uploadFileName = `scan-documents/${fileName || new Date().toISOString()}.png`;
      const imageRef = ref(storage, uploadFileName);

      const snapshot = await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);

       await addDoc(collection(db, "images"), {
        url: downloadUrl,
        createdAt: new Date(),
        fileName: fileName,
      });

      onUploadSuccess(downloadUrl);

      toast.success("Image uploaded successfully! 🎉");
    } catch (error) {
      onUploadError(error);

      toast.error("Error uploading image! 😵");
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className={`border border-gray-300 rounded-md px-3 py-2 mt-4 focus:outline-none focus:ring focus:ring-blue-400 ${
          fileNameError ? "border-red-500" : ""
        }`}
        required
      />
      {fileNameError && (
        <p className="text-red-500 text-sm mt-1">{fileNameError}</p>
      )}

      <button
        onClick={uploadImage}
        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
      >
        Upload Image
      </button>

      <button
        onClick={goToDashboard}
        className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Upload;
