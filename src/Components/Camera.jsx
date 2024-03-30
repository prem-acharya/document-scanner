import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CropImage from "./CropImage";
import ScannerGIF from "../Images/Scanner.gif";

const Camera = () => {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const videoRef = useRef(null);
  const [showOpenCameraButton, setShowOpenCameraButton] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setShowCamera(true);
      setShowOpenCameraButton(false);
    } catch (error) {
      // console.error("Error accessing the camera", error);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImageDataUrl(dataUrl);
    setShowCamera(false);

    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    toast.success("Image captured!");
  };

  return (
    <div className="flex flex-col items-center">
      {showOpenCameraButton && (
      <>
      <div>
        <img src={ScannerGIF} className="" alt="Scanner GIF" />
      </div>
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white font-semibold m-4 px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
        >
          Open Camera
        </button>
      </>
      )}
      {showCamera && stream && (
        <div className="mt-4">
          <video
            autoPlay={true}
            ref={videoRef}
            className="w-full rounded-lg shadow-md"
          />
          <button
            className="absolute mt-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-md z-10 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            onClick={captureImage}
          >
            Capture Image
          </button>
        </div>
      )}
      {imageDataUrl && <CropImage imageDataUrl={imageDataUrl} toast={toast} />}
      <ToastContainer />
    </div>
  );
};

export default Camera;
