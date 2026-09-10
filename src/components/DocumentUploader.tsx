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
  Check,
  Code,
  ChevronDown,
  ChevronUp,
  Copy,
  Camera
} from 'lucide-react';
import { compressImageToTarget, formatKB } from '../utils/imageCompressor';
import { performOcrAndExtract } from '../utils/ocrParser';
import { processPdfDocument, createDemoAadhaarPdf } from '../utils/pdfProcessor';
import { maskAadhaarNumber } from '../utils/aadhaarUtils';
import { ExtractedDocData, Language, UploadedDocument } from '../types';
import { SAMPLE_AADHAAR_MOCK, SAMPLE_BAAL_AADHAAR_MOCK, SAMPLE_TEHRI_AADHAAR_MOCK } from '../data/uttarakhandData';
import { ExtractedJsonModal } from './ExtractedJsonModal';
import { DocumentScannerModal } from './DocumentScannerModal';

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

  // State for JSON viewer modal & inline inspector
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonModalData, setJsonModalData] = useState<ExtractedDocData | null>(null);
  const [jsonModalDocName, setJsonModalDocName] = useState<string>('Aadhaar_Document');
  const [showInlineJsonInspector, setShowInlineJsonInspector] = useState(false);
  const [inlineCopied, setInlineCopied] = useState(false);

  // State for Document Camera Scanner Modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const openJsonViewer = (data: ExtractedDocData, docName: string) => {
    setJsonModalData(data);
    setJsonModalDocName(docName);
    setIsJsonModalOpen(true);
  };

  /**
   * Handle document scanned from live camera
   */
  const handleScannedDocument = async (scannedDataUrl: string, docName: string, docType: string) => {
    setIsProcessing(true);
    try {
      setOcrProgress({
        percent: 25,
        status: isHi ? 'स्कैन किए गए दस्तावेज़ का 200KB संपीड़न...' : 'Compressing scanned document to <200KB...'
      });

      // 1. Ensure < 200KB compliance
      const compressed = await compressImageToTarget(scannedDataUrl, 195, 1800);

      // 2. Perform OCR & Auto-Fill Extraction
      setOcrProgress({
        percent: 50,
        status: isHi ? 'स्मार्ट OCR द्वारा टेक्स्ट एवं विवरण निकाला जा रहा है...' : 'Extracting identity data with AI OCR...'
      });

      const extracted = await performOcrAndExtract(compressed.dataUrl, (p, status) => {
        setOcrProgress({ percent: Math.round(45 + p * 0.5), status });
      });

      const newDoc: UploadedDocument = {
        id: `doc_scan_${Date.now()}`,
        docType: docType || selectedDocType,
        name: docName,
        originalSizeKB: Math.round(((scannedDataUrl.length * 0.75) / 1024) * 10) / 10,
        compressedSizeKB: compressed.compressedSizeKB,
        dataUrl: compressed.dataUrl,
        mimeType: 'image/jpeg',
        uploadTimestamp: Date.now(),
        isCompressed: true,
        ocrExtracted: true,
        extractedData: extracted
      };

      const updated = [newDoc, ...documents];
      onDocumentsChange(updated);
      setJustExtractedData(extracted);
      onAutoFillData(extracted);
    } catch (err) {
      console.error('Scanned document processing error:', err);
    } finally {
      setIsProcessing(false);
      setOcrProgress(null);
    }
  };

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
        setOcrProgress({
          percent: 20,
          status: isHi ? 'दस्तावेज़ का आकार जांच एवं 200KB संपीड़न...' : 'Compressing document to <200KB...'
        });

        const compressed = await compressImageToTarget(file, 195, 1800);
        const isCompressed = originalSizeKB > 200;

        // Perform OCR & Auto-Fill Extraction
        setOcrProgress({
          percent: 45,
          status: isHi ? 'स्मार्ट OCR द्वारा टेक्स्ट एवं विवरण निकाला जा रहा है...' : 'Extracting identity data with AI OCR...'
        });

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
    setOcrProgress({
      percent: 20,
      status: isHi ? 'डेमो ई-आधार PDF उत्पन्न किया जा रहा है...' : 'Generating Official e-Aadhaar PDF...'
    });

    try {
      const demoPdf = await createDemoAadhaarPdf();
      await handleFileSelected(demoPdf.file);
    } catch (err) {
      console.error('Demo PDF generation error:', err);
      setIsProcessing(false);
      setOcrProgress(null);
    }
  };

  // Helper to load mock Aadhaar image
  const handleLoadDemoAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({
      percent: 30,
      status: isHi ? 'डेमो आधार कार्ड तैयार किया जा रहा है...' : 'Preparing Demo Uttarakhand ID...'
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1000, 900);

      // TOP SECTION: Letter Dispatch (Above Scissor Line)
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

      // SCISSOR CUT LINE
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(40, 240);
      ctx.lineTo(960, 240);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✂ --- यहाँ से काटिए / Cut along this line (Aadhaar Card Below) --- ✂', 210, 232);

      // BOTTOM SECTION: Official Aadhaar Card
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

      // Text Fields
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
      const compressed = await compressImageToTarget(dataUrl, 180);

      const demoDoc: UploadedDocument = {
        id: `demo_${Date.now()}`,
        docType: 'Aadhaar Card / आधार कार्ड',
        name: 'Demo_Aadhaar_Card_ScissorLine.jpg',
        originalSizeKB: 840.2,
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
    }, 700);
  };

  // Helper to load Baal Aadhaar (Almora - Aadhaya Kargeti) demo
  const handleLoadDemoBaalAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({
      percent: 35,
      status: isHi ? 'बाल आधार कार्ड (अल्मोड़ा) तैयार किया जा रहा है...' : 'Preparing Baal Aadhaar (Almora)...'
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1000, 900);

      ctx.fillStyle = '#0a5c44';
      ctx.fillRect(40, 25, 920, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('भारतीय विशिष्ट पहचान प्राधिकरण | UNIQUE IDENTIFICATION AUTHORITY OF INDIA', 80, 57);

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

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 5;
      ctx.strokeRect(40, 270, 920, 590);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(40, 270, 920, 65);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('भारत सरकार | Government of India (बाल आधार)', 260, 312);

      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(80, 360, 180, 220);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 360, 180, 220);
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('[ शिशु फोटो / Child ]', 90, 480);

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
    }, 700);
  };

  // Helper to load Tehri Garhwal Aadhaar (Sarswati - 249175) demo
  const handleLoadDemoTehriAadhaar = async () => {
    setIsProcessing(true);
    setOcrProgress({
      percent: 35,
      status: isHi ? 'टिहरी गढ़वाल आधार कार्ड (सरस्वती) लोड हो रहा है...' : 'Loading Tehri Garhwal Aadhaar (Sarswati)...'
    });

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

  // Active extracted data to show in inline inspector
  const activeExtractedData = justExtractedData || documents[0]?.extractedData || null;

  return (
    <div className="mb-8">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
              2
            </span>
            {isHi ? 'दस्तावेज़ स्कैन/अपलोड, स्वतः संपीड़न (<200KB) व स्वतः फॉर्म प्रविष्टि' : 'Document Scan / Upload, Auto-Compress (<200KB) & Auto-Fill'}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {isHi
              ? 'कैमरा से स्कैन करें या आधार कार्ड, बाल आधार, राशन कार्ड फाइल अपलोड करें। 200KB से अधिक होने पर स्वतः छोटा होगा और फॉर्म भर जाएगा।'
              : 'Scan live with camera or upload Aadhaar, Baal Aadhaar, Ration Card. Auto-compresses to strictly <200KB & auto-fills form.'}
          </p>
        </div>

        {/* Fast Test Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setIsScannerOpen(true)}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-lg text-xs font-black shadow-sm hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer ring-2 ring-emerald-400/50"
            title="कैमरा से दस्तावेज़ स्कैन करें"
          >
            <Camera size={14} className="text-amber-300 animate-pulse" />
            <span>{isHi ? 'कैमरा से स्कैन करें' : 'Scan via Camera'}</span>
          </button>

          <button
            onClick={handleLoadDemoTehriAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg text-xs font-bold shadow-sm hover:from-slate-700 hover:to-slate-800 transition-all cursor-pointer border border-slate-700"
            title="टिहरी गढ़वाल आधार कार्ड (सरस्वती) से तुरंत परीक्षण करें"
          >
            <Zap size={13} className="fill-current text-amber-300" />
            <span>{isHi ? 'टिहरी आधार' : 'Tehri ID'}</span>
          </button>

          <button
            onClick={handleLoadDemoBaalAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-lg text-xs font-bold shadow-sm hover:from-sky-700 hover:to-blue-800 transition-all cursor-pointer"
            title="बाल आधार कार्ड (अल्मोड़ा) से तुरंत परीक्षण करें"
          >
            <Sparkles size={13} className="fill-current" />
            <span>{isHi ? 'बाल आधार' : 'Baal Aadhaar'}</span>
          </button>

          <button
            onClick={handleLoadDemoPdfAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-lg text-xs font-bold shadow-sm hover:from-red-700 hover:to-rose-800 transition-all cursor-pointer"
            title="परीक्षण हेतु डिजिटल ई-आधार PDF लोड करें"
          >
            <FileText size={13} className="fill-current" />
            <span>{isHi ? 'ई-आधार PDF' : 'e-Aadhaar PDF'}</span>
          </button>

          <button
            onClick={handleLoadDemoAadhaar}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-xs font-bold shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer"
            title="तुरंत परीक्षण हेतु आधार कार्ड इमेज लोड करें"
          >
            <Zap size={13} className="fill-current" />
            <span>{isHi ? 'आधार फोटो' : 'Aadhaar Photo'}</span>
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
                  {isHi ? 'दस्तावेज़ स्कैन करें या फाइल खींचें/चुनें' : 'Scan via Camera or Drag & Drop Document'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Camera size={11} className="text-emerald-600" />
                  Live Scan Ready
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  .PDF Supported
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isHi
                  ? 'लाइव कैमरा स्कैनर (AI OCR), PDF (ई-आधार), JPG, PNG, WebP (उत्तराखंड पोर्टल मानक: अधिकतम 200 KB स्वतः संपीड़ित होगा)'
                  : 'Live Camera Scanner (AI OCR), PDF (e-Aadhaar), JPG, PNG, WebP (Auto-compressed to strictly < 200 KB)'}
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

          {/* Right Action Buttons: Scan via Camera Beside Upload File */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-shrink-0">
            {/* 1. Live Camera Scan Button */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer border border-emerald-500/40"
              title={isHi ? 'कैमरा चालू कर दस्तावेज़ स्कैन करें' : 'Scan document directly using camera'}
            >
              <Camera size={16} className="text-amber-300" />
              <span>{isHi ? 'कैमरा से स्कैन करें' : 'Scan Document'}</span>
            </button>

            {/* 2. File Browser Button */}
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
              className="w-full sm:w-auto btn-primary px-4 py-2.5 text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              title={isHi ? 'कंप्यूटर/मोबाइल से फाइल चुनें' : 'Browse local PDF or Image file'}
            >
              <Upload size={16} />
              <span>{isHi ? 'फाइल चुनें' : 'Upload File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Just Extracted Banner Notification with Direct JSON Viewer Trigger */}
      {justExtractedData && (
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 rounded-xl shadow-sm animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-emerald-950">
                  {isHi ? 'दस्तावेज़ से डेटा सफलतापूर्वक निकाला गया!' : 'Document Data Extracted Successfully!'}
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
                  ? `नाम: ${justExtractedData.fullNameHi || justExtractedData.fullName || 'N/A'} (${justExtractedData.fullName || 'N/A'}) | पिता: ${justExtractedData.fatherHusbandNameHi || justExtractedData.fatherHusbandName || 'N/A'} | जन्म तिथि: ${justExtractedData.dob || 'N/A'} | जिला: ${justExtractedData.districtHi || justExtractedData.district || 'N/A'} | पिन: ${justExtractedData.pinCode || 'N/A'} | आधार: ${maskAadhaarNumber(justExtractedData.aadhaarNumber) || 'N/A'}`
                  : `Extracted: ${justExtractedData.fullName || 'N/A'} (${justExtractedData.fullNameHi || ''}), Father: ${justExtractedData.fatherHusbandName || 'N/A'}, DOB: ${justExtractedData.dob || 'N/A'}, District: ${justExtractedData.district || 'N/A'}, PIN: ${justExtractedData.pinCode || 'N/A'}, Aadhaar: ${maskAadhaarNumber(justExtractedData.aadhaarNumber) || 'N/A'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              onClick={() => openJsonViewer(justExtractedData, selectedDocType)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-emerald-700 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 shadow-sm transition-all cursor-pointer hover:bg-emerald-50"
              title="निष्कर्षित JSON डेटा देखें"
            >
              <Code size={14} className="text-emerald-600" />
              <span>{isHi ? '{ } डेटा JSON देखें' : '{ } View Extracted JSON'}</span>
            </button>

            <button
              onClick={() => setJustExtractedData(null)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-2.5 py-1.5 rounded bg-white/80 border border-emerald-200 shadow-2xs cursor-pointer"
            >
              {isHi ? 'ठीक है (OK)' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-600" />
              {isHi ? 'अपलोड एवं संकुचित दस्तावेज़ सूची' : 'Attached & Compressed Documents'}
              <span className="bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full text-[11px]">
                {documents.length}
              </span>
            </h4>

            {activeExtractedData && (
              <button
                onClick={() => setShowInlineJsonInspector(!showInlineJsonInspector)}
                className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-300 transition-colors cursor-pointer"
              >
                <Code size={13} className="text-emerald-600" />
                <span>{isHi ? 'OCR इंजन JSON विश्लेषक' : 'OCR Engine JSON Inspector'}</span>
                {showInlineJsonInspector ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>

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

                      {/* Compression & Extraction Badges */}
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
                    {doc.extractedData && (
                      <button
                        onClick={() => openJsonViewer(doc.extractedData!, doc.name)}
                        className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title={isHi ? 'डेटा JSON देखें' : 'View Extracted JSON'}
                      >
                        <Code size={14} className="text-emerald-600" />
                        <span className="hidden sm:inline">JSON</span>
                      </button>
                    )}

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

      {/* Inline Live JSON Inspector Panel (Collapsible) */}
      {showInlineJsonInspector && activeExtractedData && (
        <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-md animate-fade-in text-slate-100">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-bold text-sm text-white">
                  {isHi ? 'आधार OCR इंजन - निष्कर्षित JSON आउटपुट' : 'Aadhaar OCR Engine - Live Extracted JSON'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isHi
                    ? 'इंजन द्वारा निकाले गए फ़ील्ड्स (नाम, पिता का नाम, जन्म तिथि, पता, पिन कोड, आधार संख्या)'
                    : 'Structured data parsed from document (Name, Father Name, DOB, Address, PIN, Aadhaar)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activeExtractedData, null, 2));
                  setInlineCopied(true);
                  setTimeout(() => setInlineCopied(false), 2000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                {inlineCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{inlineCopied ? 'Copied!' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={() => openJsonViewer(activeExtractedData, 'Aadhaar_Document')}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-lg text-white transition-colors cursor-pointer"
              >
                <Eye size={12} />
                <span>{isHi ? 'फुल स्क्रीन व्यू' : 'Expand Inspector'}</span>
              </button>
            </div>
          </div>

          <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-64 overflow-y-auto">
            {JSON.stringify(
              {
                ...activeExtractedData,
                aadhaarNumber: maskAadhaarNumber(activeExtractedData.aadhaarNumber)
              },
              null,
              2
            )}
          </pre>
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
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  {isHi ? '200 KB सरकारी मानक के अनुसार संकुचित' : 'Optimized & Compressed (< 200 KB)'}
                </span>

                {previewDoc.extractedData && (
                  <button
                    onClick={() => {
                      const data = previewDoc.extractedData!;
                      const name = previewDoc.name;
                      setPreviewDoc(null);
                      openJsonViewer(data, name);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer ml-2"
                  >
                    <Code size={13} />
                    <span>{isHi ? 'डेटा JSON देखें' : 'View Extracted JSON'}</span>
                  </button>
                )}
              </div>

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

      {/* Extracted JSON Data Full Screen / Detailed Modal */}
      <ExtractedJsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        extractedData={jsonModalData}
        documentName={jsonModalDocName}
        language={language}
      />

      {/* Live Document Camera Scanner Modal */}
      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScannedDocument}
        defaultDocType={selectedDocType}
        language={language}
      />
    </div>
  );
};
