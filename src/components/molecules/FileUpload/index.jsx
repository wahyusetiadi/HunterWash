import React, { useRef, useState, useEffect } from 'react';

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);

  // Start camera stream when the component mounts or when isCameraOpen is true
  useEffect(() => {
    let currentStream;

    const startCamera = async () => {
      if (isCameraOpen && !stream) {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
            videoRef.current.play();
          }
          setStream(currentStream); // Store the stream
          setIsCameraReady(true);
        } catch (err) {
          console.error('Error accessing camera: ', err);
        }
      }
    };

    // Start the camera when isCameraOpen is true
    startCamera();

    // Cleanup the stream when camera is closed or component unmounts
    return () => {
      if (currentStream) {
        const tracks = currentStream.getTracks();
        tracks.forEach((track) => track.stop());
        setStream(null); // Clear the stream
      }
    };
  }, [isCameraOpen]); // Effect only runs when `isCameraOpen` changes

  // Handle taking a photo by drawing the video frame onto the canvas
  const handleTakePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/png');
      setPhoto(photoData);

      // Stop the camera after taking the photo
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraOpen(false); // Close the camera
    }
  };

  // Handle retrying the photo (activating the camera again)
  const handleRetry = () => {
    setPhoto(null);
    setIsCameraOpen(true); // Reopen the camera
  };

  // Handle saving the photo
  const handleSave = () => {
    if (photo) {
      const link = document.createElement('a');
      link.href = photo;
      link.download = 'photo.png';
      link.click();
    }
  };

  // Handle closing the camera and clearing the photo
  const handleCloseCamera = () => {
    setPhoto(null);
    setIsCameraOpen(false); // Stop the camera when closing
  };

  return (
    <div className="flex flex-col items-start justify-center">
      {!isCameraOpen && !photo ? (
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setIsCameraOpen(true)}
        >
          Open Camera
        </button>
      ) : (
        <div className="space-y-4">
          {isCameraReady && !photo && (
            <div>
              <video
                ref={videoRef}
                className="border-2 border-gray-300 rounded-md"
                style={{ width: '100%', maxHeight: '400px' }}
              />
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={handleTakePhoto}
                >
                  Take Photo
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleCloseCamera}
                >
                  Close Camera
                </button>
              </div>
            </div>
          )}

          {photo && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Photo Preview</h2>
              <img src={photo} alt="Captured" className="max-w-full rounded-md" />
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  onClick={handleRetry}
                >
                  Take Another Photo
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleSave}
                >
                  Save Photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default Camera;
