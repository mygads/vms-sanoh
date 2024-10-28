import React, { useRef } from 'react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const imageData = canvasRef.current.toDataURL('image/png');
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="camera-page">
      <h2>Take a Selfie</h2>
      <video ref={videoRef} autoPlay className="video" />
      <canvas ref={canvasRef} width="640" height="480" hidden />
      <button onClick={handleCapture} className="button">
        Capture & Submit
      </button>
    </div>
  );
};

export default CameraCapture;
