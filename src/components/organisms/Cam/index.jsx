import React, { useState, useRef, useEffect } from "react";

const CameraComponent = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // To store the camera stream

  // Open camera when the button is clicked
  const openCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream; // Save the stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraOpen(true);
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
        });
    }
  };

  // Capture the photo
  //   const capturePhoto = () => {
  //     const canvas = canvasRef.current;
  //     const context = canvas.getContext("2d");
  //     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  //     const imageUrl = canvas.toDataURL();
  //     setPhoto(imageUrl);
  //     setIsCaptured(true);
  //     stopCamera(); // Stop camera after capture
  //   };
  const capturePhoto = () => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;

    // Ensure the video is playing and the canvas context is ready
    if (videoElement && canvas) {
      // Get the context of the canvas
      const context = canvas.getContext("2d");

      // Only capture if video element is ready (ensure video is playing)
      if (videoElement.readyState === 4) {
        // Set the canvas size to match the video feed
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL (image)
        const imageUrl = canvas.toDataURL();
        setPhoto(imageUrl); // Save the photo to state
        setIsCaptured(true); // Update captured state

        // Stop the camera stream after capturing
        stopCamera();
      } else {
        console.log("Video is not ready yet.");
      }
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraOpen(false);
    }
  };

  // Reset to initial state
  const retakePhoto = () => {
    setIsCaptured(false);
    setPhoto(null);
    setIsCameraOpen(true);
    openCamera(); // Re-open the camera
  };

  // Handle save photo
  const savePhoto = () => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = "captured-photo.png";
    link.click();
  };

  // Stop camera when cancelling or component unmounts
  const cancelCamera = () => {
    stopCamera(); // Stop the camera when canceling
  };

  // Cleanup camera when the component unmounts
  useEffect(() => {
    return () => {
      stopCamera(); // Ensure camera is stopped when the component unmounts
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {!isCameraOpen && !isCaptured && (
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-full"
          onClick={openCamera}
        >
          Ambil Foto
        </button>
      )}

      {isCameraOpen && !isCaptured && (
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            width="300"
            height="225"
            className="border rounded-md mb-4"
          />
          <div>
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-full mr-4"
              onClick={capturePhoto}
            >
              Capture
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-full"
              onClick={cancelCamera} // Use cancelCamera function
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {isCaptured && photo && (
        <div className="flex flex-col items-center">
          <img
            src={photo}
            alt="Captured"
            className="w-64 h-48 object-cover mb-4"
          />
          <div>
            <button
              className="px-6 py-2 bg-yellow-500 text-white rounded-full mr-4"
              onClick={retakePhoto}
            >
              Ambil Ulang
            </button>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-full"
              onClick={savePhoto}
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} width="300" height="225" className="hidden" />
    </div>
  );
};

export default CameraComponent;
