import React, { useState, useRef, useEffect } from "react";

const FileUpload = () => {
  const [fileName, setFileName] = useState(""); // To store selected file name
  const [filePreview, setFilePreview] = useState(""); // For file preview
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Flag to open camera
  const videoRef = useRef(null); // Reference to video element
  const canvasRef = useRef(null); // Reference to canvas to capture photo

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      setFilePreview(fileUrl); // Show the file preview
    }
  };

  // Open the camera and start streaming
  const openCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true }) // Request access to the video stream
      .then((stream) => {
        videoRef.current.srcObject = stream; // Attach the stream to the video element
      })
      .catch((err) => {
        console.error("Error accessing the camera:", err);
        alert("Unable to access the camera.");
        setIsCameraOpen(false);
      });
  };

  // Capture the photo from the video stream
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set the canvas dimensions to match the video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Create a data URL for the captured image and show it as preview
    const photoURL = canvas.toDataURL("image/png");
    setFilePreview(photoURL);
    setIsCameraOpen(false);
  };

  // Stop the camera stream
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  useEffect(() => {
    // Cleanup the camera when the component is unmounted
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {/* File input button styled with Tailwind CSS */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
      >
        Take a Photo
      </label>

      {/* The file input is hidden but triggers when the label is clicked */}
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange} // Trigger the file change handler
      />

      {/* Button to trigger the camera manually */}
      <button
        onClick={openCamera}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all duration-300"
      >
        Open Camera
      </button>

      {/* Camera and capture button */}
      {isCameraOpen && (
        <div className="mt-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-w-md h-auto rounded-md"
          />
          <button
            onClick={capturePhoto}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Capture Photo
          </button>
          <button
            onClick={stopCamera}
            className="mt-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all duration-300"
          >
            Stop Camera
          </button>
        </div>
      )}

      {/* Display the selected or captured photo */}
      {filePreview && (
        <div className="mt-4">
          <img
            src={filePreview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-md border-2 border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
