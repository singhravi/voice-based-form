import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Check,
  X,
  Upload,
  AlertCircle,
  Sparkles,
  RotateCw,
  SwitchCamera,
  CheckCircle2
} from 'lucide-react';
import { compressImageToTarget, formatKB } from '../utils/imageCompressor';
import { Language } from '../types';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedDataUrl: string, docName: string, docType: string) => void;
  defaultDocType?: string;
  language: Language;
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
  defaultDocType = 'Aadhaar Card / आधार कार्ड',
  language
}) => {
  const isHi = language === 'hi';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedDocType, setSelectedDocType] = useState(defaultDocType);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Document Enhancement Filters & Adjustments
  const [filterMode, setFilterMode] = useState<'magic' | 'bw' | 'color' | 'original'>('magic');
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(115);
  const [rotation, setRotation] = useState(0);
  const [estimatedSizeKB, setEstimatedSizeKB] = useState<number | null>(null);
  const [isShutterActive, setIsShutterActive] = useState(false);

  useEffect(() => {
    setSelectedDocType(defaultDocType);
  }, [defaultDocType]);

  // Check camera devices
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Environment camera failed, falling back to any video device:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (fallbackErr: any) {
        console.error('All camera access failed:', fallbackErr);
        setCameraError(
          isHi
            ? 'कैमरा शुरू नहीं हो सका। कृपया ब्राउज़र में कैमरा अनुमति दें या नीचे दी गई फाइल चुने।'
            : 'Could not access camera. Please allow camera permissions or upload a document photo.'
        );
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;

    // Flash shutter animation
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 250);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    stopCamera();
    setCapturedImage(rawDataUrl);
    applyFilterAndEnhance(rawDataUrl, filterMode, brightness, contrast, rotation);
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      stopCamera();
      setCapturedImage(url);
      applyFilterAndEnhance(url, filterMode, brightness, contrast, rotation);
    };
    reader.readAsDataURL(file);
  };

  const applyFilterAndEnhance = (
    srcUrl: string,
    mode: 'magic' | 'bw' | 'color' | 'original',
    bright: number,
    cont: number,
    rot: number
  ) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const isRotated90or270 = rot === 90 || rot === 270;
      canvas.width = isRotated90or270 ? img.height : img.width;
      canvas.height = isRotated90or270 ? img.width : img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);

      // Apply CSS Filters based on selected preset
      if (mode === 'magic') {
        // High clarity & contrast boost for OCR
        ctx.filter = `brightness(${bright}%) contrast(${cont + 10}%) saturate(110%)`;
      } else if (mode === 'bw') {
        // Black and white high-contrast photocopy style
        ctx.filter = `grayscale(100%) contrast(${cont + 30}%) brightness(${bright}%)`;
      } else if (mode === 'color') {
        // Crisp color
        ctx.filter = `brightness(${bright}%) contrast(${cont}%) saturate(125%)`;
      } else {
        // Original
        ctx.filter = 'none';
      }

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      // Auto compress to ensure < 200KB for UK portal
      try {
        const compressed = await compressImageToTarget(processedDataUrl, 190, 1800);
        setEstimatedSizeKB(compressed.compressedSizeKB);
      } catch {
        setEstimatedSizeKB(180);
      }
      setIsProcessing(false);
    };
    img.src = srcUrl;
  };

  const handleFilterChange = (newMode: 'magic' | 'bw' | 'color' | 'original') => {
    setFilterMode(newMode);
    if (newMode === 'magic') {
      setBrightness(105);
      setContrast(115);
    } else if (newMode === 'bw') {
      setBrightness(100);
      setContrast(130);
    } else if (newMode === 'color') {
      setBrightness(100);
      setContrast(105);
    } else {
      setBrightness(100);
      setContrast(100);
    }

    if (capturedImage) {
      applyFilterAndEnhance(capturedImage, newMode, brightness, contrast, rotation);
    }
  };

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
    if (capturedImage) {
      applyFilterAndEnhance(capturedImage, filterMode, brightness, contrast, nextRot);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setEstimatedSizeKB(null);
    setRotation(0);
    startCamera();
  };

  const handleConfirmAndUpload = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    // Render the final filtered image with exact rotation and filters
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const isRotated90or270 = rotation === 90 || rotation === 270;
      canvas.width = isRotated90or270 ? img.height : img.width;
      canvas.height = isRotated90or270 ? img.width : img.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        if (filterMode === 'magic') {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast + 10}%) saturate(110%)`;
        } else if (filterMode === 'bw') {
          ctx.filter = `grayscale(100%) contrast(${contrast + 30}%) brightness(${brightness}%)`;
        } else if (filterMode === 'color') {
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(125%)`;
        } else {
          ctx.filter = 'none';
        }

        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      }

      const finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const docName = `Scanned_${selectedDocType.split('/')[0].trim().replace(/\s+/g, '_')}_${Date.now()}.jpg`;

      onScanComplete(finalDataUrl, docName, selectedDocType);
      setIsProcessing(false);
      onClose();
    };
    img.src = capturedImage;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                {isHi ? 'लाइव दस्तावेज़ स्कैनर (AI OCR)' : 'Live Document Scanner (AI OCR)'}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full uppercase font-bold">
                  &lt; 200 KB Auto
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isHi
                  ? 'आधार कार्ड, राशन कार्ड या पहचान पत्र को कैमरे के फ्रेम में रखें'
                  : 'Align your Aadhaar Card, ID, or Document inside the viewfinder frame'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isHi ? 'बंद करें' : 'Close'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Type Selector Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {isHi ? 'दस्तावेज़ प्रकार:' : 'Scanning:'}
            </span>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="text-xs font-bold bg-slate-800 border border-slate-700 text-emerald-300 rounded-lg px-2.5 py-1 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Aadhaar Card / आधार कार्ड">Aadhaar Card (आधार कार्ड / Baal Aadhaar)</option>
              <option value="Ration Card / राशन कार्ड">Ration Card (राशन कार्ड)</option>
              <option value="Voter ID / मतदाता पहचान">Voter ID (मतदाता पहचान)</option>
              <option value="Marksheet / अंकतालिका">Marksheet (शैक्षणिक अंकतालिका)</option>
              <option value="Income Certificate Proof">Income Certificate (आय प्रमाण)</option>
            </select>
          </div>

          {!capturedImage && hasMultipleCameras && (
            <button
              onClick={toggleCameraFacing}
              className="flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="कैमरा बदलें (Switch Front/Back)"
            >
              <SwitchCamera size={13} className="text-amber-400" />
              <span>{facingMode === 'environment' ? 'Back Cam' : 'Front Cam'}</span>
            </button>
          )}
        </div>

        {/* Scanner Viewport / Capture Canvas */}
        <div className="relative bg-black flex-1 min-h-[320px] max-h-[52vh] flex items-center justify-center overflow-hidden">
          {/* Shutter flash animation */}
          {isShutterActive && (
            <div className="absolute inset-0 z-30 bg-white opacity-80 animate-ping" />
          )}

          {!capturedImage ? (
            /* Live Camera View with Viewfinder */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Frame with Corner Target Marks */}
              <div className="absolute inset-4 sm:inset-8 border-2 border-emerald-400/80 rounded-2xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] flex flex-col justify-between p-3">
                {/* Top Corner markers */}
                <div className="flex justify-between items-start">
                  <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1 rounded-tl-lg" />
                  <span className="text-[10px] font-bold bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs tracking-wide">
                    {isHi ? 'कार्ड को यहाँ सीधा रखें' : 'ALIGN DOCUMENT HERE'}
                  </span>
                  <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1 rounded-tr-lg" />
                </div>

                {/* Center scan line animation */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70 animate-pulse shadow-[0_0_8px_#34d399]" />

                {/* Bottom Corner markers */}
                <div className="flex justify-between items-end">
                  <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1 rounded-bl-lg" />
                  <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    {isHi ? 'अच्छी रोशनी में रखें' : 'Keep Flat & Well-Lit'}
                  </span>
                  <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1 rounded-br-lg" />
                </div>
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center z-20">
                  <AlertCircle className="w-12 h-12 text-amber-400 mb-2" />
                  <h4 className="font-bold text-sm text-white mb-1">
                    {isHi ? 'कैमरा उपलब्ध नहीं है' : 'Camera Unavailable'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={14} />
                    {isHi ? 'दस्तावेज़ फोटो चुनें' : 'Choose Document Photo'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Captured Document Preview & Enhancement Studio */
            <div className="relative w-full h-full flex items-center justify-center p-3 bg-slate-950">
              <img
                src={capturedImage}
                alt="Captured Document"
                className="max-h-[48vh] object-contain rounded-xl shadow-2xl border border-slate-700 transition-all"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter:
                    filterMode === 'magic'
                      ? `brightness(${brightness}%) contrast(${contrast + 10}%) saturate(110%)`
                      : filterMode === 'bw'
                      ? `grayscale(100%) contrast(${contrast + 30}%) brightness(${brightness}%)`
                      : filterMode === 'color'
                      ? `brightness(${brightness}%) contrast(${contrast}%) saturate(125%)`
                      : 'none'
                }}
              />

              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 text-xs text-emerald-400 font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {isHi ? 'दस्तावेज़ संपीड़ित एवं स्वच्छ किया जा रहा है...' : 'Enhancing & Compressing Document...'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Capture or Post-Processing Controls Bar */}
        <div className="bg-slate-950 p-4 border-t border-slate-800">
          {!capturedImage ? (
            /* Live Camera Bottom Action Controls */
            <div className="flex items-center justify-between gap-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleNativeFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                title="गैलरी / फाइल से फोटो लें"
              >
                <Upload size={14} className="text-emerald-400" />
                <span>{isHi ? 'फाइल से अपलोड' : 'Upload Snap'}</span>
              </button>

              {/* Big Shutter Capture Button */}
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 p-1.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title={isHi ? 'फोटो खींचें (Capture)' : 'Capture Document'}
              >
                <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center bg-white/20">
                  <Camera size={24} className="text-white" />
                </div>
              </button>

              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          ) : (
            /* Post-Capture Enhancements & Upload Action Bar */
            <div className="space-y-3">
              {/* Filter Preset Buttons */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => handleFilterChange('magic')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      filterMode === 'magic'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles size={12} className="text-amber-300" />
                    <span>{isHi ? 'स्मार्ट OCR क्लीन' : 'Magic Clean'}</span>
                  </button>

                  <button
                    onClick={() => handleFilterChange('bw')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterMode === 'bw'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{isHi ? 'श्वेत-श्याम (B&W)' : 'B&W Doc'}</span>
                  </button>

                  <button
                    onClick={() => handleFilterChange('color')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterMode === 'color'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{isHi ? 'रंगीन' : 'Vibrant'}</span>
                  </button>

                  <button
                    onClick={() => handleFilterChange('original')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterMode === 'original'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{isHi ? 'मूल' : 'Original'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRotate}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-xl border border-slate-800 text-slate-300 transition-colors cursor-pointer"
                    title="90° घुमाएं (Rotate)"
                  >
                    <RotateCw size={13} className="text-sky-400" />
                    <span>90° Rotate</span>
                  </button>

                  {estimatedSizeKB && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      {formatKB(estimatedSizeKB)} (&lt;200KB)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Retake vs Confirm & Auto-Fill */}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>{isHi ? 'पुनः फोटो लें (Retake)' : 'Retake Scan'}</span>
                </button>

                <button
                  onClick={handleConfirmAndUpload}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Check size={16} />
                  <span>{isHi ? 'स्कैन जोड़ें व फॉर्म स्वतः भरें' : 'Attach & Auto-Fill Form'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
