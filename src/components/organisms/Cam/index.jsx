import React, { useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onSave }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState('');

  const handleStartCamera = () => {
    setIsCameraOn(true);
    setMessage('');
  };

  const handleCapture = (webcamRef) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageUrl(imageSrc);
    setIsCameraOn(false); // Turn off camera after capturing image
  };

  const handleRetake = () => {
    setImageUrl(null);
    setIsCameraOn(true); // Turn camera back on to retake photo
    setMessage('');
  };

  const handleSave = () => {
    if (imageUrl) {
      // Simulate saving to database or any other logic
      onSave(imageUrl);
      setMessage('Gambar berhasil disimpan!');
      setImageUrl(null);
      setIsCameraOn(false);
    }
  };

  const handleCancel = () => {
    setImageUrl(null);
    setIsCameraOn(false); // Turn off camera
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Set image from file input
        setMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const webcamRef = React.useRef(null);

  return (
    <div>
      {!isCameraOn && !imageUrl && !message && (
        <div className="flex justify-center items-center gap-2 mb-2">
          <button
            className="py-2 px-4 rounded-lg bg-blue-500 text-white font-medium"
            onClick={handleStartCamera}
          >
            Ambil Gambar
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="py-2 px-4 rounded-lg bg-gray-500 text-white font-medium cursor-pointer"
          >
            Unggah Foto
          </label>
        </div>
      )}

      {isCameraOn && !imageUrl && !message && (
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
            <button
              className="py-2 px-4 rounded-lg bg-blue-500 text-white font-medium mb-2"
              onClick={() => handleCapture(webcamRef)}
            >
              Capture
            </button>
            <button
              className="py-2 px-4 rounded-lg bg-red-500 text-white font-medium mb-2"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {imageUrl && !message && (
        <div>
          <img src={imageUrl} alt="Captured" width="100%" />
          <div className="flex gap-4 justify-center mt-4">
            <button
              className="py-2 px-4 rounded-lg bg-yellow-500 text-white font-medium mb-2"
              onClick={handleRetake}
            >
              Ambil Ulang
            </button>
            <button
              className="py-2 px-4 rounded-lg bg-red-500 text-white font-medium mb-2"
              onClick={handleCancel}
            >
              Batal
            </button>
            <button
              className="py-2 px-4 rounded-lg bg-green-500 text-white font-medium mb-2"
              onClick={handleSave}
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {message && !isCameraOn && !imageUrl && (
        <div className="text-center mt-4">
          <p className="text-green-500">{message}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
