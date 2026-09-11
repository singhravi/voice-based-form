import React, { useRef, useState, useEffect } from 'react';
import { CitizenFormData, Language } from '../types';
import { GOVT_SERVICES } from '../data/uttarakhandData';
import {
  Download,
  Printer,
  X,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { formatKB } from '../utils/imageCompressor';
import { maskAadhaarNumber } from '../utils/aadhaarUtils';

interface ApplicationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CitizenFormData;
  language: Language;
}

export const ApplicationPreviewModal: React.FC<ApplicationPreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
  language
}) => {
  const isHi = language === 'hi';
  const printAreaRef = useRef<HTMLDivElement | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showAadhaarInPreview, setShowAadhaarInPreview] = useState(false);

  const serviceInfo = GOVT_SERVICES.find((s) => s.id === formData.serviceType) || GOVT_SERVICES[0];

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(printAreaRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`UK_Govt_Application_${formData.applicationNumber}.pdf`);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Instant Escape key close listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh] cursor-default"
      >
        {/* Header Controls */}
        <div className="bg-[#0a5c44] text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base">
              {isHi
                ? 'उत्तराखंड ई-डिस्ट्रिक्ट आधिकारिक आवेदन पत्र (पूर्वावलोकन)'
                : 'Uttarakhand e-District Official Application Form (Preview)'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">{isHi ? 'प्रिंट करें' : 'Print'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>{isGeneratingPdf ? (isHi ? 'PDF बन रहा है...' : 'Generating...') : isHi ? 'PDF डाउनलोड करें' : 'Download PDF'}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 ml-2 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Application Sheet */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div
            ref={printAreaRef}
            className="w-full max-w-3xl bg-white border-2 border-slate-300 p-6 sm:p-8 rounded-lg shadow-sm text-slate-900 font-sans print:border-0 print:shadow-none print:p-0"
          >
            {/* Official Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center relative">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center">
                  {/* Emblem */}
                  <svg className="w-10 h-10 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="rgba(10,92,68,0.1)" stroke="currentColor" />
                    <path d="M4 21c3-4 6-2 9-5 2-2 4-2 7 0" stroke="#f59e0b" strokeWidth="2.5" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                    उत्तराखंड शासन | GOVERNMENT OF UTTARAKHAND
                  </h1>
                  <h2 className="text-sm font-bold text-emerald-800 uppercase">
                    {serviceInfo.departmentHi} / {serviceInfo.departmentEn}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    e-District Portal • Certificate Application Form / ई-प्रमाण पत्र आवेदन पत्र
                  </p>
                </div>
              </div>

              {/* Barcode & App Number */}
              <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-600">Application Ref No: </span>
                  <span className="font-extrabold text-slate-950 text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {formData.applicationNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-600">Date: </span>
                  <span className="font-bold">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            </div>

            {/* Service Title */}
            <div className="my-4 p-3 bg-emerald-50 border border-emerald-300 rounded text-center">
              <span className="text-xs font-bold text-emerald-900 block">आवेदन का प्रकार (Applied Service):</span>
              <span className="text-base font-extrabold text-emerald-950">
                {serviceInfo.nameHi} ({serviceInfo.nameEn})
              </span>
            </div>

            {/* Top Details & Passport Photo Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-3 space-y-3">
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <th className="p-2 bg-slate-50 font-bold w-1/3 border-r border-slate-300">
                        आवेदक का नाम (Applicant Name):
                      </th>
                      <td className="p-2 font-bold text-slate-950">
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-slate-950">{formData.fullName}</span>
                          {formData.fullNameHi && (
                            <span className="text-xs font-semibold text-emerald-800">हिंदी: {formData.fullNameHi}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                        पिता / पति का नाम (Father/Husband):
                      </th>
                      <td className="p-2 font-semibold">
                        <div className="flex flex-col">
                          <span>{formData.fatherHusbandName} ({formData.relationType})</span>
                          {formData.fatherHusbandNameHi && (
                            <span className="text-xs font-semibold text-emerald-800">हिंदी: {formData.fatherHusbandNameHi}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                        माता का नाम (Mother's Name):
                      </th>
                      <td className="p-2 font-semibold">
                        <div className="flex flex-col">
                          <span>{formData.motherName || 'N/A'}</span>
                          {formData.motherNameHi && (
                            <span className="text-xs font-semibold text-emerald-800">हिंदी: {formData.motherNameHi}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                        जन्म तिथि / लिंग (DOB / Gender):
                      </th>
                      <td className="p-2 font-semibold">
                        {formData.dob || 'N/A'} | {formData.gender}
                      </td>
                    </tr>
                    <tr>
                      <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                        आधार संख्या (Aadhaar No):
                      </th>
                      <td className="p-2 font-mono font-bold text-slate-950">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="tracking-wider">
                              {showAadhaarInPreview
                                ? formData.aadhaarNumber || 'N/A'
                                : maskAadhaarNumber(formData.aadhaarNumber) || 'N/A'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                              UIDAI
                            </span>
                          </div>
                          {formData.aadhaarNumber && (
                            <button
                              type="button"
                              onClick={() => setShowAadhaarInPreview(!showAadhaarInPreview)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              title={showAadhaarInPreview ? 'आधार संख्या छिपाएं' : 'पूरी आधार संख्या देखें'}
                            >
                              {showAadhaarInPreview ? (
                                <>
                                  <EyeOff size={12} className="text-slate-600" />
                                  <span>{isHi ? 'छिपाएं' : 'Hide'}</span>
                                </>
                              ) : (
                                <>
                                  <Eye size={12} className="text-emerald-700" />
                                  <span>{isHi ? 'देखें' : 'Show'}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Passport Photo Box */}
              <div className="col-span-1 flex flex-col items-center justify-center p-2 border-2 border-slate-400 bg-slate-50 rounded">
                {formData.applicantPhotoUrl ? (
                  <img
                    src={formData.applicantPhotoUrl}
                    alt="Passport"
                    className="w-28 h-36 object-cover border border-slate-300 rounded shadow-xs"
                  />
                ) : (
                  <div className="w-28 h-36 border border-dashed border-slate-400 flex flex-col items-center justify-center text-[10px] text-slate-500 text-center p-1">
                    <span>पासपोर्ट फोटो</span>
                    <span className="text-[8px]">&lt;50 KB</span>
                  </div>
                )}
                <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase">
                  Verified Photo
                </span>
              </div>
            </div>

            {/* Address & Residence Details */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider bg-slate-200 px-3 py-1.5 border border-slate-300 mb-2">
                निवास एवं संपर्क विवरण (Residence & Contact Details - Bilingual / द्विभाषी)
              </h4>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <th className="p-2 bg-slate-50 font-bold w-1/4 border-r border-slate-300">
                      राज्य (State):
                    </th>
                    <td className="p-2 font-bold w-1/4 border-r border-slate-300">
                      {formData.state || 'Uttarakhand'} {formData.stateHi ? `(${formData.stateHi})` : ''}
                    </td>
                    <th className="p-2 bg-slate-50 font-bold w-1/4 border-r border-slate-300">
                      पिन कोड (PIN Code):
                    </th>
                    <td className="p-2 font-mono font-bold w-1/4 text-emerald-950">
                      {formData.pinCode || 'N/A'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <th className="p-2 bg-slate-50 font-bold w-1/4 border-r border-slate-300">
                      जिला (District):
                    </th>
                    <td className="p-2 font-bold w-1/4 border-r border-slate-300">
                      {formData.district} {formData.districtHi ? `(${formData.districtHi})` : ''}
                    </td>
                    <th className="p-2 bg-slate-50 font-bold w-1/4 border-r border-slate-300">
                      तहसील (Tehsil):
                    </th>
                    <td className="p-2 font-bold w-1/4">
                      {formData.tehsil} {formData.tehsilHi ? `(${formData.tehsilHi})` : ''}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      डाकघर (Post Office):
                    </th>
                    <td className="p-2 border-r border-slate-300">
                      <div className="font-semibold">{formData.postOffice || 'N/A'}</div>
                      {formData.postOfficeHi && (
                        <div className="text-[11px] text-emerald-800 font-semibold">{formData.postOfficeHi}</div>
                      )}
                    </td>
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      थाना / पुलिस स्टेशन (Police Station):
                    </th>
                    <td className="p-2">
                      <div className="font-semibold">{formData.policeStation || 'N/A'}</div>
                      {formData.policeStationHi && (
                        <div className="text-[11px] text-emerald-800 font-semibold">{formData.policeStationHi}</div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      ग्राम / वार्ड (Village/Ward):
                    </th>
                    <td className="p-2 border-r border-slate-300">
                      <div>{formData.villageWard || 'N/A'}</div>
                      {formData.villageWardHi && (
                        <div className="text-[11px] text-emerald-800 font-semibold">{formData.villageWardHi}</div>
                      )}
                    </td>
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      मोबाइल नंबर (Mobile):
                    </th>
                    <td className="p-2 font-semibold">{formData.mobileNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      पूरा पता (Full Address):
                    </th>
                    <td colSpan={3} className="p-2">
                      <div className="font-medium text-slate-900">{formData.addressLine || 'N/A'}</div>
                      {formData.addressLineHi && (
                        <div className="text-xs text-emerald-800 font-semibold mt-0.5">हिंदी: {formData.addressLineHi}</div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      ईमेल (Email):
                    </th>
                    <td colSpan={3} className="p-2 font-mono text-slate-700">{formData.email || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Socio-Economic Details */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider bg-slate-200 px-3 py-1.5 border border-slate-300 mb-2">
                सामाजिक एवं आर्थिक विवरण (Socio-Economic Info)
              </h4>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <th className="p-2 bg-slate-50 font-bold w-1/4 border-r border-slate-300">
                      जाति वर्ग (Category):
                    </th>
                    <td className="p-2 font-semibold w-1/4 border-r border-slate-300">{formData.casteCategory}</td>
                    <th className="p-2 bg-slate-50 font-bold w-1/4 border-r border-slate-300">
                      वार्षिक आय (Annual Income):
                    </th>
                    <td className="p-2 font-bold w-1/4">₹ {formData.annualIncome || '0'}</td>
                  </tr>
                  <tr>
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      व्यवसाय (Occupation):
                    </th>
                    <td className="p-2 border-r border-slate-300">{formData.occupation}</td>
                    <th className="p-2 bg-slate-50 font-bold border-r border-slate-300">
                      निवास अवधि (Duration):
                    </th>
                    <td className="p-2">{formData.livingSinceYears ? `${formData.livingSinceYears} Years` : 'Permanent'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Attached Documents Table */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider bg-slate-200 px-3 py-1.5 border border-slate-300 mb-2">
                संलग्न प्रमाणित दस्तावेज़ (&lt;200KB संपीड़ित)
              </h4>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                    <th className="p-2 border-r border-slate-300 w-12">क्र.</th>
                    <th className="p-2 border-r border-slate-300">दस्तावेज़ का नाम</th>
                    <th className="p-2 border-r border-slate-300">आकार (&lt;200KB)</th>
                    <th className="p-2">सत्यापन स्थिति</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.documents.map((doc, idx) => (
                    <tr key={doc.id} className="border-b border-slate-300">
                      <td className="p-2 border-r border-slate-300 font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-semibold">{doc.docType}</td>
                      <td className="p-2 border-r border-slate-300 font-mono text-emerald-800">
                        {formatKB(doc.compressedSizeKB)}
                      </td>
                      <td className="p-2 font-semibold text-emerald-700">
                        ✓ Verified & Auto-Filled
                      </td>
                    </tr>
                  ))}
                  {formData.documents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-2 text-center text-slate-500 italic">
                        कोई दस्तावेज़ संलग्न नहीं है
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Citizen Self Declaration in Official Preview */}
            <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
              <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>स्व-घोषणा (Citizen Self Declaration):</span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  ✓ डिजिटल रूप से स्वीकृत (Digitally Accepted)
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                "मैं प्रमाणित करता/करती हूँ कि आवेदन में दी गई समस्त जानकारी पूर्णतः सत्य एवं सही है। यदि कोई भी विवरण असत्य अथवा भ्रामक पाया गया तो मेरा आवेदन बिना किसी पूर्व सूचना के निरस्त किया जा सकता है।"
              </p>
            </div>

            {/* Footer Signatures */}
            <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-end text-xs">
              <div className="space-y-1">
                <p className="font-bold">सत्यापन अधिकारी (e-District Cell):</p>
                <p className="text-slate-500 text-[10px]">Digital Verification Stamp UK-GOV-CERT</p>
                <div className="w-24 h-8 border border-slate-300 bg-slate-50 flex items-center justify-center text-[9px] text-emerald-700 font-bold">
                  ✓ VERIFIED
                </div>
              </div>

              <div className="text-right space-y-4">
                <div className="w-40 border-b border-slate-900 mx-auto" />
                <p className="font-bold">आवेदक के हस्ताक्षर / Signature of Applicant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>
              {isHi
                ? 'आवेदन पत्र पूरी तरह तैयार है। इसे सुरक्षित रूप से डाउनलोड या प्रिंट कर सकते हैं।'
                : 'Application ready. Compliant with Uttarakhand portal standards.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="btn-primary text-xs py-2 px-5 shadow-sm cursor-pointer"
            >
              <Download size={14} />
              {isHi ? 'आधिकारिक PDF डाउनलोड करें' : 'Download Official Application PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
