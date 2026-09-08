import React, { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  Zap,
  CheckCircle2,
  Trash2,
  Eye,
  FileText,
  RefreshCw,
  Check
} from 'lucide-react';
import { compressImageToTarget, formatKB } from '../utils/imageCompressor';
import { performOcrAndExtract } from '../utils/ocrParser';
import { processPdfDocument, createDemoAadhaarPdf } from '../utils/pdfProcessor';
import { maskAadhaarNumber } from '../utils/aadhaarUtils';
import { ExtractedDocData, Language, UploadedDocument } from '../types';
import { SAMPLE_AADHAAR_MOCK, SAMPLE_BAAL_AADHAAR_MOCK, SAMPLE_TEHRI_AADHAAR_MOCK } from '../data/uttarakhandData';

interface DocumentUploaderProps {
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
  onAutoFillData: (data: ExtractedDocData) => void;
  language: Language;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documents,
  onDocumentsChange,
  onAutoFillData,
  language
}) => {
  const isHi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedDocType, setSelectedDocType] = useState('Aadhaar Card / आधार कार्ड');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<{ percent: number; status: string } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [justExtractedData, setJustExtractedData] = useState<ExtractedDocData | null>(null);

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    const originalSizeKB = file.size / 1024;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    try {
      if (isPdf) {
        // PDF File Handling (e-Aadhaar or Scanned PDF)
        setOcrProgress({
          percent: 20,
          status: isHi ? 'PDF दस्तावेज़ का विश्लेषण व पेज निष्कर्षण...' : 'Analyzing PDF & extracting text layers...'
        });

        const pdfResult = await processPdfDocument(file, (p, status) => {
          setOcrProgress({ percent: p, status });
        });

        const isCompressed = originalSizeKB > 200;
        const newDoc: UploadedDocument = {
          id: `doc_${Date.now()}`,
          docType: selectedDocType,
          name: file.name,
          originalSizeKB: Math.round(originalSizeKB * 10) / 10,
          compressedSizeKB: pdfResult.compressed.compressedSizeKB,
          dataUrl: pdfResult.renderedDataUrl,
          mimeType: 'application/pdf',
          uploadTimestamp: Date.now(),
          isCompressed,
          ocrExtracted: true,
          extractedData: pdfResult.extractedData
        };

        const updated = [newDoc, ...documents];
        onDocumentsChange(updated);
        setJustExtractedData(pdfResult.extractedData);
        onAutoFillData(pdfResult.extractedData);
      } else {
        // Image File Handling (JPG, PNG, WebP)
        // 1. Auto-Compression to ensure <= 200KB (UK Govt Portal compliance)
        setOcrProgress({ percent: 20, status: isHi ? 'दस्तावेज़ का आकार जांच एवं 200KB संपीड़न...' : 'Compressing document to <200KB...' });
        
        const compressed = await compressImageToTarget(file, 195, 1800);
        const isCompressed = originalSizeKB > 200;

        // 2. Perform OCR & Auto-Fill Extraction
        setOcrProgress({ percent: 45, status: isHi ? 'स्मार्ट OCR द्वारा टेक्स्ट एवं विवरण निकाला जा रहा है...' : 'Extracting identity data with AI OCR...' });
        
        const extracted = await performOcrAndExtract(compressed.dataUrl, (p, status) => {
          setOcrProgress({ percent: Math.round(40 + p * 0.55), status });
        });

        const newDoc: UploadedDocument = {
          id: `doc_${Date.now()}`,
          docType: selectedDocType,
          name: file.name,
          originalSizeKB: Math.round(originalSizeKB * 10) / 10,
          compressedSizeKB: compressed.compressedSizeKB,
          dataUrl: compressed.dataUrl,
          mimeType: file.type || 'image/jpeg',
          uploadTimestamp: Date.now(),
          isCompressed,
          ocrExtracted: true,
          extractedData: extracted
        };

        const updated = [newDoc, ...documents];
        onDocumentsChange(updated);
        setJustExtractedData(extracted);
        onAutoFillData(extracted);
      }
    } catch (err) {
      console.error('Document processing failed:', err);
    } finally {
      setIsProcessing(false);
      setOcrProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleRemoveDoc = (id: string) => {
    onDocumentsChange(documents.filter((d) => d.id !== id));
  };

  // Helper to test demo e-Aadhaar PDF
  const handleLoadDemoPdfAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({ percent: 20, status: isHi ? 'डेमो ई-आधार PDF उत्पन्न किया जा रहा है...' : 'Generating Official e-Aadhaar PDF...' });

    try {
      const demoPdf = await createDemoAadhaarPdf();
      await handleFileSelected(demoPdf.file);
    } catch (err) {
      console.error('Demo PDF generation error:', err);
      setIsProcessing(false);
      setOcrProgress(null);
    }
  };

  // Helper to load mock Aadhaar image for instant interactive demo
  const handleLoadDemoAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({ percent: 30, status: isHi ? 'डेमो आधार कार्ड तैयार किया जा रहा है...' : 'Preparing Demo Uttarakhand ID...' });

    // Create a mock canvas Aadhaar sheet with upper letter and scissor cut line
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // White page Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1000, 900);
      
      // ==========================================
      // TOP SECTION: Letter Dispatch (Above Scissor Line)
      // ==========================================
      ctx.fillStyle = '#0a5c44';
      ctx.fillRect(40, 25, 920, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('भारतीय विशिष्ट पहचान प्राधिकरण | UNIQUE IDENTIFICATION AUTHORITY OF INDIA', 80, 57);

      ctx.fillStyle = '#475569';
      ctx.font = '15px sans-serif';
      ctx.fillText('नामांकन संख्या / Enrollment No: 2044/58291/09821', 50, 105);
      ctx.fillText('जारी तिथि / Issue Date: 12/08/2026', 700, 105);

      // Recipient box
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 120, 900, 80);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('सेवा में / To: Ramesh Singh Negi (रमेश सिंह नेगी)', 70, 150);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('H.No 42, Deodar Enclave, Rajpur Road, Dehradun, Uttarakhand - 248001', 70, 180);

      // ==========================================
      // SCISSOR CUT LINE (✂ यहाँ से काटिए / Cut along this line ✂)
      // ==========================================
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(40, 240);
      ctx.lineTo(960, 240);
      ctx.stroke();
      ctx.setLineDash([]); // reset line dash

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✂ --- यहाँ से काटिए / Cut along this line (Aadhaar Card Below) --- ✂', 210, 232);

      // ==========================================
      // BOTTOM SECTION: Official Aadhaar Card (Below Scissor Line)
      // ==========================================
      ctx.strokeStyle = '#0a5c44';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 260, 920, 600);

      // Card Header
      ctx.fillStyle = '#0a5c44';
      ctx.fillRect(40, 260, 920, 70);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('भारत सरकार | GOVERNMENT OF INDIA', 270, 305);

      // Photo placeholder
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(80, 360, 180, 230);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 360, 180, 230);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('[ फोटो / Photo ]', 105, 480);

      // Text Fields (Below Scissor line)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('नाम / Name: Ramesh Singh Negi (रमेश सिंह नेगी)', 290, 390);
      ctx.fillText('पिता / Father: Birendra Singh Negi (बीरेंद्र सिंह नेगी)', 290, 440);
      ctx.fillText('जन्म तिथि / DOB: 14/05/1996', 290, 490);
      ctx.fillText('लिंग / Gender: Male / पुरुष', 290, 540);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('पता / Address: H.No 42, Deodar Enclave, Rajpur Road, Post: Rajpur, Thana: Rajpur', 290, 600);
      ctx.fillText('District: Dehradun (देहरादून), Tehsil: Dehradun Sadar, PIN: 248001', 290, 640);

      // Aadhaar Big Red Number Box
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(80, 700, 840, 70);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 700, 840, 70);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('7829  4410  9821', 320, 748);
      
      // Bottom banner
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(40, 800, 920, 55);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('मेरा आधार, मेरी पहचान (MERA AADHAAR, MERI PEHCHAN)', 230, 835);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setTimeout(async () => {
      // Auto compress to < 200KB
      const compressed = await compressImageToTarget(dataUrl, 180);

      const demoDoc: UploadedDocument = {
        id: `demo_${Date.now()}`,
        docType: 'Aadhaar Card / आधार कार्ड',
        name: 'Demo_Aadhaar_Card_ScissorLine.jpg',
        originalSizeKB: 840.2, // Simulating a high-res capture
        compressedSizeKB: compressed.compressedSizeKB,
        dataUrl: compressed.dataUrl,
        mimeType: 'image/jpeg',
        uploadTimestamp: Date.now(),
        isCompressed: true,
        ocrExtracted: true,
        extractedData: {
          ...SAMPLE_AADHAAR_MOCK,
          belowScissorLineExtracted: true
        }
      };

      onDocumentsChange([demoDoc, ...documents]);
      onAutoFillData({
        ...SAMPLE_AADHAAR_MOCK,
        belowScissorLineExtracted: true
      });
      setJustExtractedData({
        ...SAMPLE_AADHAAR_MOCK,
        belowScissorLineExtracted: true
      });
      setIsProcessing(false);
      setOcrProgress(null);
    }, 800);
  };

  // Helper to load Baal Aadhaar (Almora - Aadhaya Kargeti) demo
  const handleLoadDemoBaalAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({ percent: 35, status: isHi ? 'बाल आधार कार्ड (अल्मोड़ा) तैयार किया जा रहा है...' : 'Preparing Baal Aadhaar (Almora)...' });

    // Mock canvas for Baal Aadhaar
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1000, 900);

      // Header
      ctx.fillStyle = '#0a5c44';
      ctx.fillRect(40, 25, 920, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('भारतीय विशिष्ट पहचान प्राधिकरण | UNIQUE IDENTIFICATION AUTHORITY OF INDIA', 80, 57);

      // Recipient box (Baal Aadhaar format)
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 90, 900, 140);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('To: Aadhaya Kargeti', 70, 120);
      ctx.fillText('D/O Asha Kargeti', 70, 145);
      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('taya po taya, Talya, PO: Chaunallia, Sub District: Bhikia Sain, District: Almora, PIN: 263680', 70, 175);
      ctx.fillText('Mobile: 9410341276', 70, 205);

      // Scissor line
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(40, 250);
      ctx.lineTo(960, 250);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('✂ --- बाल आधार (यहाँ से काटिए / Cut along this line) --- ✂', 240, 245);

      // Baal Aadhaar Card below
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 5;
      ctx.strokeRect(40, 270, 920, 590);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(40, 270, 920, 65);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('भारत सरकार | Government of India (बाल आधार)', 260, 312);

      // Photo placeholder
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(80, 360, 180, 220);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 360, 180, 220);
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('[ शिशु फोटो / Child ]', 90, 480);

      // Child details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Aadhaya Kargeti (आध्या करगेती)', 290, 390);
      ctx.fillText('D/O Asha Kargeti (आशा करगेती)', 290, 435);
      ctx.fillText('जन्म तिथि/DOB: 02/05/2024', 290, 480);
      ctx.fillText('महिला/FEMALE', 290, 525);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('यह आधार 5 वर्ष की उम्र तक ही वैध है (Valid till 5 years of age)', 290, 570);

      ctx.font = '17px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Address: Talya, Chaunallia, Bhikiasain, Almora, Uttarakhand - 263680', 290, 620);

      // Red Aadhaar Number Box
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(80, 690, 840, 70);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 690, 840, 70);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('3881  2746  1164', 320, 738);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(40, 790, 920, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('मेरा आधार, मेरी पहचान (UIDAI BAL AADHAAR - ALMORA)', 240, 822);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setTimeout(async () => {
      const compressed = await compressImageToTarget(dataUrl, 180);

      const demoDoc: UploadedDocument = {
        id: `baal_${Date.now()}`,
        docType: 'Aadhaar Card / आधार कार्ड',
        name: 'Baal_Aadhaar_Almora_Aadhaya.jpg',
        originalSizeKB: 720.4,
        compressedSizeKB: compressed.compressedSizeKB,
        dataUrl: compressed.dataUrl,
        mimeType: 'image/jpeg',
        uploadTimestamp: Date.now(),
        isCompressed: true,
        ocrExtracted: true,
        extractedData: SAMPLE_BAAL_AADHAAR_MOCK
      };

      onDocumentsChange([demoDoc, ...documents]);
      onAutoFillData(SAMPLE_BAAL_AADHAAR_MOCK);
      setJustExtractedData(SAMPLE_BAAL_AADHAAR_MOCK);
      setIsProcessing(false);
      setOcrProgress(null);
    }, 800);
  };

  // Helper to load Tehri Garhwal Aadhaar (Sarswati - 249175) demo
  const handleLoadDemoTehriAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({ percent: 35, status: isHi ? 'टिहरी गढ़वाल आधार कार्ड (सरस्वती) लोड हो रहा है...' : 'Loading Tehri Garhwal Aadhaar (Sarswati)...' });

    setTimeout(async () => {
      const demoDoc: UploadedDocument = {
        id: `tehri_${Date.now()}`,
        docType: 'Aadhaar Card / आधार कार्ड',
        name: 'Aadhaar_Tehri_Garhwal_Sarswati.jpg',
        originalSizeKB: 640.5,
        compressedSizeKB: 172.4,
        dataUrl: '',
        mimeType: 'image/jpeg',
        uploadTimestamp: Date.now(),
        isCompressed: true,
        ocrExtracted: true,
        extractedData: SAMPLE_TEHRI_AADHAAR_MOCK
      };

      onDocumentsChange([demoDoc, ...documents]);
      onAutoFillData(SAMPLE_TEHRI_AADHAAR_MOCK);
      setJustExtractedData(SAMPLE_TEHRI_AADHAAR_MOCK);
      setIsProcessing(false);
      setOcrProgress(null);
    }, 600);
  };

  return (
    <div className="mb-8">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
              2
            </span>
            {isHi ? 'दस्तावेज़ अपलोड, स्वतः संपीड़न (<200KB) व स्वतः फॉर्म प्रविष्टि' : 'Document Upload, Auto-Compress (<200KB) & Auto-Fill'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {isHi
              ? 'आधार कार्ड, बाल आधार, राशन कार्ड या पहचान पत्र अपलोड करें। 200KB से अधिक होने पर स्वतः छोटा होगा और फॉर्म भर जाएगा।'
              : 'Upload Aadhaar, Baal Aadhaar, Ration Card or ID. If size is >200KB it will auto-compress and auto-fill form fields.'}
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={handleLoadDemoTehriAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg text-xs font-bold shadow-sm hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer"
            title="टिहरी गढ़वाल आधार कार्ड (सरस्वती) से तुरंत परीक्षण करें"
          >
            <Zap size={14} className="fill-current text-amber-300" />
            <span>{isHi ? 'आधार (टिहरी - सरस्वती)' : 'Try Aadhaar (Tehri - Sarswati)'}</span>
          </button>

          <button
            onClick={handleLoadDemoBaalAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-lg text-xs font-bold shadow-sm hover:from-sky-700 hover:to-blue-800 transition-all cursor-pointer"
            title="बाल आधार कार्ड (अल्मोड़ा) से तुरंत परीक्षण करें"
          >
            <Sparkles size={14} className="fill-current" />
            <span>{isHi ? 'बाल आधार (अल्मोड़ा) टेस्ट' : 'Try Baal Aadhaar (Almora)'}</span>
          </button>

          <button
            onClick={handleLoadDemoPdfAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-lg text-xs font-bold shadow-sm hover:from-red-700 hover:to-rose-800 transition-all cursor-pointer"
            title="परीक्षण हेतु डिजिटल ई-आधार PDF लोड करें"
          >
            <FileText size={14} className="fill-current" />
            <span>{isHi ? 'ई-आधार PDF से टेस्ट करें' : 'Try e-Aadhaar PDF'}</span>
          </button>

          <button
            onClick={handleLoadDemoAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-xs font-bold shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer"
            title="तुरंत परीक्षण हेतु आधार कार्ड इमेज लोड करें"
          >
            <Zap size={14} className="fill-current" />
            <span>{isHi ? 'आधार कार्ड फोटो से टेस्ट' : 'Try Aadhaar Photo'}</span>
          </button>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative bg-white border-2 border-dashed border-emerald-300 rounded-2xl p-6 transition-all hover:border-emerald-500 hover:bg-emerald-50/20 shadow-sm"
      >
        {isProcessing && (
          <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-16 h-16 mb-4">
              <RefreshCw className="w-16 h-16 text-emerald-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            
            <h4 className="text-base font-bold text-slate-900 mb-1">
              {ocrProgress?.status || (isHi ? 'प्रसंस्करण जारी है...' : 'Processing Document...')}
            </h4>
            
            {ocrProgress && (
              <div className="w-full max-w-xs mt-3">
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${ocrProgress.percent}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">
                  {ocrProgress.percent}%
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Icon & Text */}
          <div className="flex items-center gap-4 text-center md:text-left flex-1">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <h3 className="font-bold text-slate-900 text-base">
                  {isHi ? 'दस्तावेज़ फाइल (PDF या इमेज) यहाँ खींचें या चुनें' : 'Drag & Drop your document (.PDF, .JPG, .PNG)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  .PDF Supported
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isHi
                  ? 'समर्थित: PDF (ई-आधार), JPG, PNG, WebP (उत्तराखंड पोर्टल मानक: अधिकतम 200 KB स्वतः संपीड़ित होगा)'
                  : 'Supported: PDF (e-Aadhaar / scanned ID), JPG, PNG, WebP (Auto-compressed to strictly < 200 KB)'}
              </p>
              
              {/* Document Type Dropdown */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  {isHi ? 'दस्तावेज़ प्रकार:' : 'Document Type:'}
                </span>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Aadhaar Card / आधार कार्ड">Aadhaar Card (आधार कार्ड / e-Aadhaar PDF)</option>
                  <option value="Ration Card / राशन कार्ड">Ration Card (राशन कार्ड)</option>
                  <option value="Voter ID / मतदाता पहचान">Voter ID (मतदाता पहचान)</option>
                  <option value="Marksheet / अंकतालिका">Marksheet (शैक्षणिक अंकतालिका)</option>
                  <option value="Income Certificate Proof">Income Certificate Proof (आय प्रमाण)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*, application/pdf, .pdf, .jpg, .jpeg, .png, .webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary px-5 py-2.5 text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <Upload size={16} />
              {isHi ? 'PDF / दस्तावेज़ चुनें व स्वतः भरें' : 'Browse PDF/File & Auto-Fill'}
            </button>
          </div>
        </div>
      </div>

      {/* Just Extracted Banner Notification */}
      {justExtractedData && (
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 rounded-xl shadow-sm animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-emerald-950">
                  {isHi ? 'दस्तावेज़ (PDF/इमेज) से डेटा सफलतापूर्वक निकाला गया!' : 'Document Data Extracted Successfully!'}
                </span>
                <span className="badge-ocr">
                  <Sparkles size={11} />
                  AI / OCR Verified
                </span>
                {justExtractedData.belowScissorLineExtracted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    ✂️ {isHi ? 'कैंची रेखा के नीचे का कार्ड डेटा' : 'Aadhaar Card Below Scissor Line'}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                {isHi
                  ? `नाम: ${justExtractedData.fullNameHi || justExtractedData.fullName || 'N/A'} (${justExtractedData.fullName || 'N/A'}) | पिता: ${justExtractedData.fatherHusbandNameHi || justExtractedData.fatherHusbandName || 'N/A'} | जिला: ${justExtractedData.districtHi || justExtractedData.district || 'N/A'} | पिन: ${justExtractedData.pinCode || 'N/A'} | आधार: ${maskAadhaarNumber(justExtractedData.aadhaarNumber) || 'N/A'}`
                  : `Extracted: ${justExtractedData.fullName || 'N/A'} (${justExtractedData.fullNameHi || ''}), Father: ${justExtractedData.fatherHusbandName || 'N/A'}, District: ${justExtractedData.district || 'N/A'}, PIN: ${justExtractedData.pinCode || 'N/A'}, Aadhaar: ${maskAadhaarNumber(justExtractedData.aadhaarNumber) || 'N/A'}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setJustExtractedData(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded bg-white border border-emerald-200 shadow-2xs self-end sm:self-auto cursor-pointer"
          >
            {isHi ? 'ठीक है (OK)' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Uploaded Documents List with Before/After Compression Metrics */}
      {documents.length > 0 && (
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-600" />
            {isHi ? 'अपलोड एवं संकुचित दस्तावेज़ सूची' : 'Attached & Compressed Documents'}
            <span className="bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full text-[11px]">
              {documents.length}
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc) => {
              const isPdfDoc = doc.mimeType === 'application/pdf' || doc.name.toLowerCase().endsWith('.pdf');
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:border-emerald-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      onClick={() => setPreviewDoc(doc)}
                      className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer flex-shrink-0 relative group flex items-center justify-center"
                    >
                      <img
                        src={doc.dataUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Eye size={14} />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-slate-900 text-xs truncate">
                          {doc.docType}
                        </h5>
                        {isPdfDoc && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200 flex-shrink-0">
                            PDF
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{doc.name}</p>

                      {/* Compression Metrics Badge */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <Check size={10} />
                          {formatKB(doc.compressedSizeKB)} (&lt;200 KB)
                        </span>

                        {doc.originalSizeKB > doc.compressedSizeKB && (
                          <span className="text-[10px] text-slate-500 line-through">
                            {formatKB(doc.originalSizeKB)}
                          </span>
                        )}

                        {doc.ocrExtracted && (
                          <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                            {isPdfDoc ? 'PDF Auto-Filled' : 'AI Auto-Filled'}
                          </span>
                        )}

                        {doc.extractedData?.belowScissorLineExtracted && (
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            ✂️ Cut-Line
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="दस्तावेज़ देखें (Preview)"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="हटाएं (Delete)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Document Full Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base">{previewDoc.docType}</h4>
                  {(previewDoc.mimeType === 'application/pdf' || previewDoc.name.toLowerCase().endsWith('.pdf')) && (
                    <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded">
                      PDF Document
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {previewDoc.name} • {formatKB(previewDoc.compressedSizeKB)}
                  {(previewDoc.mimeType === 'application/pdf' || previewDoc.name.toLowerCase().endsWith('.pdf'))
                    ? ' (Page 1 Rendered & Auto-Compressed)'
                    : ''}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center bg-slate-100">
              <img
                src={previewDoc.dataUrl}
                alt={previewDoc.name}
                className="max-h-[60vh] object-contain rounded-lg shadow-md border border-slate-300"
              />
            </div>

            <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} />
                {isHi ? '200 KB सरकारी मानक के अनुसार संकुचित' : 'Optimized & Compressed (< 200 KB)'}
              </span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="btn-primary text-xs py-1.5 px-4 cursor-pointer"
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
