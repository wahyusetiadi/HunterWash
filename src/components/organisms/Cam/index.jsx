import React, { useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onSave }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleStartCamera = () => {
    setIsCameraOn(true);
  };

  const handleCapture = (webcamRef) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageUrl(imageSrc);
    setIsCameraOn(false); // Turn off camera after capturing image
  };

  const handleRetake = () => {
    setImageUrl(null);
    setIsCameraOn(true); // Turn camera back on to retake photo
  };

  const handleSave = () => {
    if (imageUrl) {
      // Simulate saving to database or any other logic
      onSave(imageUrl);
    }
  };

  const handleCancel = () => {
    setImageUrl(null);
    setIsCameraOn(false); // Turn off camera
  };

  const webcamRef = React.useRef(null);

  return (
    <div>
      {!isCameraOn && !imageUrl && (
        <button className='py-2 px-4 rounded-lg bg-blue-500 text-white font-medium mb-2' onClick={handleStartCamera}>Ambil Gambar</button>
      )}

      {isCameraOn && !imageUrl && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            // videoConstraints={{ facingMode: "user" }}
            videoConstraints={{ facingMode: { exact: "environment" } }}
          />
          <div className="w-full justify-center flex gap-4 mt-4">
            <button className='py-2 px-4 rounded-lg bg-blue-500 text-white font-medium mb-2' onClick={() => handleCapture(webcamRef)}>Capture</button>
            <button className='py-2 px-4 rounded-lg bg-red-500 text-white font-medium mb-2' onClick={handleCancel}>Batal</button>
          </div>
        </div>
      )}

      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Captured" width="100%" />
          <div className='flex gap-4 justify-center mt-4'>
            <button className='py-2 px-4 rounded-lg bg-yellow-500 text-white font-medium mb-2' onClick={handleRetake}>Ambil Ulang</button>
            <button className='py-2 px-4 rounded-lg bg-red-500 text-white font-medium mb-2' onClick={handleCancel}>Batal</button>
            <button className='py-2 px-4 rounded-lg bg-green-500 text-white font-medium mb-2' onClick={handleSave}>Simpan</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
