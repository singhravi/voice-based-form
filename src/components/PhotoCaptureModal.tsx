import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, Upload, Sliders, AlertCircle, FileCheck } from 'lucide-react';
import { compressImageToTarget, createPassportPhoto, formatKB } from '../utils/imageCompressor';
import { Language } from '../types';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photoDataUrl: string, sizeKB: number) => void;
  language: Language;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  language
}) => {
  const isHi = language === 'hi';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [finalSizeKB, setFinalSizeKB] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, mode, capturedImage]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        isHi
          ? 'कैमरा शुरू करने में समस्या। कृपया कैमरा अनुमति दें या फोटो फाइल अपलोड करें।'
          : 'Could not access camera. Please allow camera permission or upload a photo file.'
      );
      setMode('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply brightness and contrast filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopCamera();
    processAndCompressPhoto(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setCapturedImage(url);
      processAndCompressPhoto(url);
    };
    reader.readAsDataURL(file);
  };

  const processAndCompressPhoto = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      // 1. Crop to standard 3.5cm x 4.5cm passport ratio
      const passportResult = await createPassportPhoto(imageUrl);
      // 2. Guarantee size is strictly < 50KB (UK Govt requirement)
      const compressed = await compressImageToTarget(passportResult.dataUrl, 48, 600);
      setCapturedImage(compressed.dataUrl);
      setFinalSizeKB(compressed.compressedSizeKB);
    } catch (err) {
      console.error('Error processing photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setFinalSizeKB(null);
    if (mode === 'camera') {
      startCamera();
    }
  };

  const handleSaveAndConfirm = () => {
    if (capturedImage && finalSizeKB) {
      onSavePhoto(capturedImage, finalSizeKB);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a5c44] to-[#128060] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base sm:text-lg">
              {isHi ? 'पासपोर्ट साइज फोटो कैप्चर एवं संपीड़न' : 'Passport Photo Studio & Auto-Compress'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => {
              setMode('camera');
              setCapturedImage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              mode === 'camera'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera size={16} />
            {isHi ? 'लाइव वेबकैम से फोटो लें' : 'Take with Live Camera'}
          </button>
          <button
            onClick={() => {
              setMode('upload');
              stopCamera();
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              mode === 'upload'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload size={16} />
            {isHi ? 'फोटो फाइल अपलोड करें' : 'Upload Existing Photo'}
          </button>
        </div>

        {/* Viewport & Controls */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center">
          {cameraError && (
            <div className="w-full mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {!capturedImage ? (
            mode === 'camera' ? (
              <div className="relative w-full max-w-sm aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                  style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                />

                {/* Passport Face Guide Oval Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-48 h-64 border-2 border-dashed border-amber-400/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center">
                    <span className="text-[10px] font-semibold text-amber-300 bg-slate-900/60 px-2 py-0.5 rounded-full mt-2">
                      {isHi ? 'चेहरा यहां रखें' : 'Align Face Here'}
                    </span>
                  </div>
                  <div className="w-64 h-1 border-t-2 border-dashed border-emerald-400/70 mt-6" />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm aspect-[3/4] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-400 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  {isHi ? 'पासपोर्ट फोटो अपलोड करें' : 'Upload Passport Photo'}
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  {isHi ? 'JPG, PNG फाइलें (स्वतः <50KB में संकुचित होंगी)' : 'JPG, PNG (Auto-compressed to <50KB)'}
                </p>
                <label className="btn-primary text-xs py-2 px-4 cursor-pointer">
                  <span>{isHi ? 'फाइल चुनें' : 'Choose Photo File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-56 bg-slate-100 rounded-lg overflow-hidden border-2 border-emerald-600 shadow-md">
                <img
                  src={capturedImage}
                  alt="Passport Preview"
                  className="w-full h-full object-cover"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white text-xs">
                    <RefreshCw className="w-6 h-6 animate-spin mb-1 text-emerald-400" />
                    <span>{isHi ? 'फोटो अनुकूलन जारी...' : 'Optimizing...'}</span>
                  </div>
                )}
              </div>

              {/* Compression Badge */}
              {finalSizeKB && (
                <div className="mt-3 flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <FileCheck size={14} className="text-emerald-600" />
                  <span>
                    {isHi
                      ? `पासपोर्ट फोटो आकार: ${formatKB(finalSizeKB)} (मानक < 50 KB के अनुरूप)`
                      : `Photo Size: ${formatKB(finalSizeKB)} (Compliant: < 50 KB)`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Sliders for Brightness / Contrast */}
          {!capturedImage && mode === 'camera' && (
            <div className="w-full max-w-sm mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                <Sliders size={13} />
                <span>{isHi ? 'कैमरा प्रकाश संतुलन' : 'Lighting Adjust'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                <div>
                  <div className="flex justify-between">
                    <span>{isHi ? 'चमक' : 'Brightness'}</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>{isHi ? 'कंट्रास्ट' : 'Contrast'}</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {isHi ? 'रद्द करें' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            {capturedImage ? (
              <>
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RefreshCw size={13} />
                  {isHi ? 'दोबारा लें' : 'Retake'}
                </button>
                <button
                  onClick={handleSaveAndConfirm}
                  disabled={isProcessing}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  <Check size={14} />
                  {isHi ? 'फोटो संलग्न करें (<50KB)' : 'Attach Photo (<50KB)'}
                </button>
              </>
            ) : mode === 'camera' ? (
              <button
                onClick={handleCapture}
                className="btn-primary text-xs py-2.5 px-5 shadow-md flex items-center gap-2"
              >
                <Camera size={16} />
                {isHi ? 'फोटो खींचें (Capture)' : 'Capture Photo'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
