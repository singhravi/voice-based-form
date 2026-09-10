import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  X,
  Sparkles,
  User,
  Users,
  Calendar,
  MapPin,
  Shield,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { ExtractedDocData, Language } from '../types';
import { maskAadhaarNumber } from '../utils/aadhaarUtils';

interface ExtractedJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedData: ExtractedDocData | null;
  documentName?: string;
  language?: Language;
}

export const ExtractedJsonModal: React.FC<ExtractedJsonModalProps> = ({
  isOpen,
  onClose,
  extractedData,
  documentName = 'Aadhaar_Document',
  language = 'en'
}) => {
  const isHi = language === 'hi';
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'fields' | 'rawText'>('json');
  const [showFullAadhaar, setShowFullAadhaar] = useState(false);

  if (!isOpen || !extractedData) return null;

  // Clean presentation copy of the JSON
  const presentationData = {
    ...extractedData,
    aadhaarNumber: showFullAadhaar
      ? extractedData.aadhaarNumber
      : maskAadhaarNumber(extractedData.aadhaarNumber)
  };

  const jsonString = JSON.stringify(presentationData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(extractedData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentName.replace(/[^a-zA-Z0-9_-]/g, '_')}_extracted.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighting for JSON code display
  const renderHighlightedJson = (json: string) => {
    const lines = json.split('\n');
    return lines.map((line, idx) => {
      const keyMatch = line.match(/^(\s*"[^"]+")(\s*:\s*)(.*)$/);
      if (keyMatch) {
        const [, key, colon, value] = keyMatch;
        let valueColor = 'text-emerald-400';
        if (value.startsWith('"')) {
          valueColor = 'text-amber-300';
        } else if (/^-?\d+(\.\d+)?/.test(value)) {
          valueColor = 'text-sky-300';
        } else if (value.startsWith('true') || value.startsWith('false')) {
          valueColor = 'text-purple-300';
        } else if (value.startsWith('null')) {
          valueColor = 'text-rose-300';
        }

        return (
          <div key={idx} className="hover:bg-slate-800/60 px-2 rounded transition-colors">
            <span className="text-sky-400 font-semibold">{key}</span>
            <span className="text-slate-400">{colon}</span>
            <span className={valueColor}>{value}</span>
          </div>
        );
      }
      return (
        <div key={idx} className="hover:bg-slate-800/60 px-2 rounded transition-colors text-slate-300">
          {line}
        </div>
      );
    });
  };

  const fieldsList = [
    {
      label: isHi ? 'आवेदक का नाम (अंग्रेजी)' : 'Full Name (English)',
      value: extractedData.fullName,
      icon: <User className="w-4 h-4 text-emerald-500" />,
      required: true
    },
    {
      label: isHi ? 'आवेदक का नाम (हिंदी)' : 'Full Name (Hindi)',
      value: extractedData.fullNameHi,
      icon: <User className="w-4 h-4 text-emerald-600" />,
      required: true
    },
    {
      label: isHi ? 'पिता / पति / अभिभावक का नाम (EN)' : 'Father / Husband Name (EN)',
      value: extractedData.fatherHusbandName,
      icon: <Users className="w-4 h-4 text-sky-500" />,
      required: true
    },
    {
      label: isHi ? 'पिता / पति / अभिभावक का नाम (HI)' : 'Father / Husband Name (HI)',
      value: extractedData.fatherHusbandNameHi,
      icon: <Users className="w-4 h-4 text-sky-600" />,
      required: true
    },
    {
      label: isHi ? 'जन्म तिथि (DOB)' : 'Date of Birth (DOB)',
      value: extractedData.dob,
      icon: <Calendar className="w-4 h-4 text-purple-500" />,
      required: true
    },
    {
      label: isHi ? 'लिंग' : 'Gender',
      value: extractedData.gender,
      icon: <User className="w-4 h-4 text-pink-500" />,
      required: true
    },
    {
      label: isHi ? 'आधार संख्या' : 'Aadhaar Number',
      value: showFullAadhaar
        ? extractedData.aadhaarNumber
        : maskAadhaarNumber(extractedData.aadhaarNumber),
      icon: <Shield className="w-4 h-4 text-amber-500" />,
      required: true,
      hasToggle: true
    },
    {
      label: isHi ? 'पता (अंग्रेजी)' : 'Address Line (English)',
      value: extractedData.addressLine,
      icon: <MapPin className="w-4 h-4 text-rose-500" />,
      required: true
    },
    {
      label: isHi ? 'पता (हिंदी)' : 'Address Line (Hindi)',
      value: extractedData.addressLineHi,
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      required: true
    },
    {
      label: isHi ? 'पिन कोड' : 'PIN Code',
      value: extractedData.pinCode,
      icon: <MapPin className="w-4 h-4 text-teal-500" />,
      required: true
    },
    {
      label: isHi ? 'जिला' : 'District',
      value: extractedData.district ? `${extractedData.district} (${extractedData.districtHi || ''})` : null,
      icon: <MapPin className="w-4 h-4 text-indigo-500" />,
      required: true
    },
    {
      label: isHi ? 'तहसील' : 'Tehsil',
      value: extractedData.tehsil ? `${extractedData.tehsil} (${extractedData.tehsilHi || ''})` : null,
      icon: <MapPin className="w-4 h-4 text-cyan-500" />,
      required: false
    },
    {
      label: isHi ? 'दस्तावेज़ प्रकार' : 'Detected Document Type',
      value: extractedData.documentTypeDetected,
      icon: <FileText className="w-4 h-4 text-slate-500" />,
      required: false
    }
  ];

  const extractedCount = fieldsList.filter((f) => !!f.value).length;
  const totalCount = fieldsList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {isHi ? 'आधार OCR इंजन - निष्कर्षित JSON डेटा' : 'Aadhaar Engine - Extracted JSON Output'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full">
                  <Sparkles size={11} />
                  {extractedCount}/{totalCount} {isHi ? 'फ़ील्ड्स प्राप्त' : 'Fields Extracted'}
                </span>
                {extractedData.confidence && (
                  <span className="text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                    {extractedData.confidence}% {isHi ? 'सटीकता' : 'Confidence'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {documentName} • {extractedData.documentTypeDetected || 'Aadhaar Card'}
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

        {/* Navigation Tabs & Actions Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code size={13} />
              <span>{isHi ? 'JSON कोड व्यू' : 'JSON Object'}</span>
            </button>

            <button
              onClick={() => setActiveTab('fields')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'fields'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle2 size={13} />
              <span>{isHi ? 'फ़ील्ड्स तालिका' : 'Field Grid'}</span>
            </button>

            {extractedData.rawText && (
              <button
                onClick={() => setActiveTab('rawText')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'rawText'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText size={13} />
                <span>{isHi ? 'कच्चा OCR टेक्स्ट' : 'Raw OCR Text'}</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {extractedData.aadhaarNumber && (
              <button
                onClick={() => setShowFullAadhaar(!showFullAadhaar)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                title={showFullAadhaar ? 'मास्क करें' : 'पूरी संख्या देखें'}
              >
                {showFullAadhaar ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showFullAadhaar ? 'Mask Aadhaar' : 'Show Full'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? (isHi ? 'कॉपी हो गया!' : 'Copied JSON!') : (isHi ? 'कॉपी JSON' : 'Copy JSON')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-sm cursor-pointer"
            >
              <Download size={14} />
              <span>{isHi ? 'JSON डाउनलोड' : 'Download .json'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-mono text-xs bg-slate-950">
          {activeTab === 'json' && (
            <div className="relative bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-inner overflow-x-auto leading-relaxed">
              {renderHighlightedJson(jsonString)}
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fieldsList.map((f, i) => {
                  const isPresent = !!f.value;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border transition-all ${
                        isPresent
                          ? 'bg-slate-900/90 border-slate-700 hover:border-emerald-500/40'
                          : 'bg-slate-900/40 border-dashed border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          {f.icon}
                          <span className="text-xs font-semibold text-slate-300">{f.label}</span>
                        </div>
                        {isPresent ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 size={10} />
                            Found
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                            <AlertCircle size={10} />
                            Not detected
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs">
                        {isPresent ? (
                          <span className="text-emerald-300 font-medium break-all">
                            {f.value}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">--</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'rawText' && extractedData.rawText && (
            <div className="space-y-3 font-sans">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                <span className="font-bold text-slate-200">ℹ️ Raw OCR Recognition Dump: </span>
                {isHi
                  ? 'यह OCR इंजन द्वारा पढ़ी गई मूल कच्ची टेक्स्ट स्ट्रिंग है, जिससे ऊपर के फ़ील्ड्स निकाले गए हैं।'
                  : 'This is the unprocessed raw text stream extracted by the OCR engine before regex and phonetic parsing.'}
              </div>

              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-[50vh] overflow-y-auto">
                {extractedData.rawText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-3.5 sm:px-5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isHi
                ? 'उत्तराखंड नागरिक डेटाबेस व फॉर्म ऑटो-फिल सिंक सक्रिय'
                : 'Uttarakhand Citizen Profile & Auto-Fill Sync Active'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
