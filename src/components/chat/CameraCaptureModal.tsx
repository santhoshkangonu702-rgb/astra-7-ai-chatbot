import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, filename: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('[Camera] Failed to access webcam/camera:', err);
      setCameraError('Camera access denied or unavailable. Check browser permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      const filename = `photo-capture-${Date.now()}.jpg`;
      onCapture(capturedImage, filename);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden bg-[#0A0E1A] border border-white/15 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-medium">
            <Camera className="w-5 h-5 text-amber-400" />
            <span>Take Photo with Camera</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-rose-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm">{cameraError}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Camera flip button */}
          {!capturedImage && !cameraError && (
            <button
              onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 border border-white/20"
              title="Flip camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 flex items-center justify-between gap-3 bg-[#080C16]">
          {capturedImage ? (
            <>
              <button
                onClick={retake}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
              >
                Retake
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Use Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={takePhoto}
                disabled={Boolean(cameraError)}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
