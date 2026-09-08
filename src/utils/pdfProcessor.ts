import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedDocData, CompressionResult } from '../types';
import { parseExtractedText, performOcrAndExtract } from './ocrParser';
import { compressImageToTarget } from './imageCompressor';

// Setup PDF.js worker
if (typeof window !== 'undefined') {
  try {
    // Set worker URL using unpkg / cdnjs fallback
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('PDF Worker initialization warning:', err);
  }
}

export interface PdfProcessingResult {
  numPages: number;
  extractedText: string;
  renderedDataUrl: string;
  compressed: CompressionResult;
  extractedData: ExtractedDocData;
  isScannedPdf: boolean;
}

/**
 * Process an uploaded PDF file (e.g. e-Aadhaar PDF or scanned PDF).
 * 1. Extracts embedded text using PDF.js text layer.
 * 2. Renders Page 1 onto Canvas for visual preview and OCR fallback.
 * 3. Compresses rendered image to < 200KB (UK Govt Portal standard).
 * 4. Extracts structured identity fields (Aadhaar, Name, DOB, Gender, Address, PIN, State, District, Tehsil, etc.).
 */
export async function processPdfDocument(
  fileOrBuffer: File | Blob | ArrayBuffer,
  onProgress?: (progressPercent: number, statusText: string) => void
): Promise<PdfProcessingResult> {
  onProgress?.(10, 'Reading PDF document structure...');

  let arrayBuffer: ArrayBuffer;
  if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer;
  } else {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
  });

  onProgress?.(25, 'Loading PDF pages & text layer...');
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  // Render Page 1 (Identity info is usually on Page 1)
  const page1 = await pdfDoc.getPage(1);
  
  // Extract digital text from all pages
  let allPagesText = '';
  for (let pageNum = 1; pageNum <= Math.min(numPages, 3); pageNum++) {
    try {
      const page = pageNum === 1 ? page1 : await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => (item.str ? item.str.trim() : ''))
        .filter((str: string) => str.length > 0);
      
      allPagesText += pageStrings.join('\n') + '\n';
    } catch (e) {
      console.warn(`Could not extract text from PDF page ${pageNum}:`, e);
    }
  }

  onProgress?.(45, 'Rendering PDF page for preview & compression...');
  // Render page 1 to Canvas at high quality
  const viewport = page1.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context creation failed');
  }

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page1.render({
    canvas: canvas,
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  const renderedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

  // Auto-compress rendered canvas image to <= 195KB (<200KB UK standard)
  onProgress?.(65, 'Compressing rendered document to <200KB...');
  const compressed = await compressImageToTarget(renderedDataUrl, 195, 1800);

  // Check if PDF had embedded digital text (like e-Aadhaar)
  const hasDigitalText = allPagesText.trim().length >= 30 && (
    /\b\d{4}\s?\d{4}\s?\d{4}\b/.test(allPagesText) ||
    /Aadhaar|Unique|DOB|Birth|Address|Male|Female|Father|भारत|आधार|नाम|पता/i.test(allPagesText)
  );

  let extractedData: ExtractedDocData = {};
  let isScannedPdf = false;

  if (hasDigitalText) {
    onProgress?.(85, 'Parsing digital text & extracting fields...');
    extractedData = parseExtractedText(allPagesText);
    extractedData.rawText = allPagesText;
    extractedData.confidence = 98; // Digital text has very high confidence
  } else {
    // Scanned PDF (image inside PDF) -> Run Tesseract OCR on rendered canvas
    isScannedPdf = true;
    onProgress?.(70, 'Scanned PDF detected. Running AI OCR on rendered page...');
    extractedData = await performOcrAndExtract(compressed.dataUrl, (p, status) => {
      onProgress?.(Math.round(65 + p * 0.3), status);
    });
  }

  onProgress?.(100, 'PDF extraction and optimization complete!');

  return {
    numPages,
    extractedText: allPagesText,
    renderedDataUrl: compressed.dataUrl,
    compressed,
    extractedData,
    isScannedPdf
  };
}

/**
 * Generate a downloadable/testable demo e-Aadhaar PDF using jsPDF
 */
/**
 * Generate a downloadable/testable demo e-Aadhaar PDF using jsPDF with authentic UIDAI letter format
 * (Top letter section + Scissor cut line + Official Aadhaar Card below scissor line)
 */
export async function createDemoAadhaarPdf(): Promise<{ file: File; dataUrl: string }> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ==========================================
  // TOP SECTION: Dispatch Letter (Above Scissor Line)
  // ==========================================
  doc.setFillColor(10, 92, 68);
  doc.rect(10, 8, 190, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('भारतीय विशिष्ट पहचान प्राधिकरण | UNIQUE IDENTIFICATION AUTHORITY OF INDIA', 15, 18);

  // Letter dispatch details
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('नामांकन संख्या / Enrollment No: 2044/58291/09821', 15, 30);
  doc.text('जारी करने की तिथि / Issue Date: 12/08/2026', 130, 30);

  // Recipient Box (Upper Sheet)
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 34, 180, 24);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('सेवा में / To: Ramesh Singh Negi (रमेश सिंह नेगी)', 20, 41);
  doc.setFont('helvetica', 'normal');
  doc.text('H.No 42, Deodar Enclave, Rajpur Road, Dehradun, Uttarakhand - 248001', 20, 48);
  doc.text('Mobile: 9876543210', 20, 54);

  // Instructions text above scissor line
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('सूचना: कृपया नीचे दिए गए आधार कार्ड को कैंची रेखा से काटकर सुरक्षित रखें।', 15, 65);
  doc.text('Note: Please cut along the scissor line below to use the official Aadhaar Card.', 15, 70);

  // ==========================================
  // SCISSOR CUT LINE (✂ यहाँ से काटिए / Cut along this line ✂)
  // ==========================================
  doc.setDrawColor(180, 83, 9);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(10, 78, 200, 78);
  doc.setLineDashPattern([], 0); // reset line dash

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('--- ✂ ---  यहाँ से काटिए / Cut along this line  --- ✂ ---', 55, 76);

  // ==========================================
  // BOTTOM SECTION: Official Aadhaar Card (Below Scissor Line)
  // ==========================================
  
  // Outer Border for Card Section
  doc.setDrawColor(10, 92, 68);
  doc.setLineWidth(0.8);
  doc.rect(10, 84, 190, 95);

  // Card Header
  doc.setFillColor(10, 92, 68);
  doc.rect(10, 84, 190, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('भारत सरकार | GOVERNMENT OF INDIA', 62, 93);

  // Tri-color thin strip
  doc.setFillColor(245, 158, 11);
  doc.rect(10, 98, 190, 2.5, 'F');

  // Photo Box (Left)
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 105, 32, 40, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(15, 105, 32, 40, 'S');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('[ Photo ]', 24, 126);

  // Identity Details (Center/Left)
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Name / नाम: Ramesh Singh Negi (रमेश सिंह नेगी)', 52, 111);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('पिता / Father (S/O): Birendra Singh Negi (बीरेंद्र सिंह नेगी)', 52, 118);
  doc.text('जन्म तिथि / DOB: 14/05/1996', 52, 125);
  doc.text('लिंग / Gender: Male / पुरुष', 52, 132);

  // Full Address Details (Below Scissor Card Section)
  doc.setFont('helvetica', 'bold');
  doc.text('पता / Address:', 52, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('H.No 42, Deodar Enclave, Rajpur Road, Post: Rajpur, Thana: Rajpur', 52, 145);
  doc.text('Tehsil: Dehradun Sadar, District: Dehradun, State: Uttarakhand', 52, 150);
  doc.setFont('helvetica', 'bold');
  doc.text('PIN Code: 248001', 52, 156);

  // Aadhaar Red Big Number Box
  doc.setFillColor(254, 242, 242);
  doc.rect(15, 160, 180, 14, 'F');
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.6);
  doc.rect(15, 160, 180, 14, 'S');

  doc.setTextColor(220, 38, 38);
  doc.setFontSize(15);
  doc.setFont('courier', 'bold');
  doc.text('7829  4410  9821', 70, 170);

  // Footer slogan
  doc.setTextColor(10, 92, 68);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('मेरा आधार, मेरी पहचान (MERA AADHAAR, MERI PEHCHAN)', 48, 185);

  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], 'e-Aadhaar_Uttarakhand_Official.pdf', { type: 'application/pdf' });
  const dataUrl = doc.output('datauristring');

  return {
    file: pdfFile,
    dataUrl
  };
}
