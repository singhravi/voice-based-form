import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { Language, UidaiEkycResult } from '../types';
import { requestUidaiAadhaarOtp, verifyUidaiAadhaarOtp } from '../utils/authService';
import { formatAadhaarNumber, maskAadhaarNumber } from '../utils/aadhaarUtils';

interface UidaiVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAadhaar?: string;
  applicantName?: string;
  language: Language;
  onEkycVerified: (ekyc: UidaiEkycResult) => void;
}

export const UidaiVerificationModal: React.FC<UidaiVerificationModalProps> = ({
  isOpen,
  onClose,
  initialAadhaar = '',
  applicantName = '',
  language,
  onEkycVerified
}) => {
  const isHi = language === 'hi';
  const [aadhaarInput, setAadhaarInput] = useState(initialAadhaar);
  const [step, setStep] = useState<'input_aadhaar' | 'input_otp' | 'success_preview'>('input_aadhaar');
  const [otpValue, setOtpValue] = useState('');
  const [activeGeneratedOtp, setActiveGeneratedOtp] = useState<string | null>(null);
  const [maskedMobile, setMaskedMobile] = useState('XXXXXX1234');
  const [verifiedEkyc, setVerifiedEkyc] = useState<UidaiEkycResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (isOpen) {
      const clean = initialAadhaar.replace(/\D/g, '').slice(0, 12);
      setAadhaarInput(clean);
      setOtpValue('');
      setErrorMsg(null);
      setVerifiedEkyc(null);
      if (clean.length === 12) {
        handleSendAadhaarOtp(clean);
      } else {
        setStep('input_aadhaar');
      }
    }
  }, [isOpen, initialAadhaar]);

  useEffect(() => {
    let timer: any;
    if (step === 'input_otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

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

  const handleSendAadhaarOtp = (targetAadhaar?: string) => {
    const aadh = (targetAadhaar || aadhaarInput).replace(/\D/g, '').slice(0, 12);
    if (aadh.length !== 12) {
      setErrorMsg(isHi ? 'कृपया 12 अंकों की वैध आधार संख्या दर्ज करें।' : 'Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = requestUidaiAadhaarOtp(aadh);
    setIsLoading(false);

    if (res.success) {
      setActiveGeneratedOtp(res.otp);
      setMaskedMobile(res.maskedMobile);
      setStep('input_otp');
      setCountdown(30);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyAadhaarOtp = (codeToVerify?: string) => {
    const code = codeToVerify || otpValue;
    if (code.trim().length !== 6) {
      setErrorMsg(isHi ? 'कृपया 6 अंकों का UIDAI OTP दर्ज करें।' : 'Please enter 6-digit UIDAI OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const cleanAadhaar = aadhaarInput.replace(/\D/g, '').slice(0, 12);
    const res = verifyUidaiAadhaarOtp(cleanAadhaar, code, applicantName);
    setIsLoading(false);

    if (res.verified && res.ekyc) {
      setVerifiedEkyc(res.ekyc);
      setStep('success_preview');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleApplyEkycData = () => {
    if (verifiedEkyc) {
      onEkycVerified(verifiedEkyc);
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-slideUp cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#c2410c] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  UIDAI e-KYC Gateway (Simulated)
                </span>
                <span className="text-[10px] bg-red-950/40 text-red-200 px-1.5 py-0.2 rounded font-mono">
                  Aadhaar 2.0
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {isHi ? 'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI) सत्यापन' : 'UIDAI Aadhaar e-KYC Verification'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 active:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {step === 'input_aadhaar' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi
                  ? 'UIDAI e-KYC के माध्यम से आपका नाम, पिता का नाम, जन्मतिथि और पता सीधे आधार डेटाबेस से सुरक्षित रूप से सत्यापित एवं फॉर्म में स्वतः भरा जाएगा।'
                  : 'Your demographics (Name, Father Name, DOB, and Address) will be securely verified and auto-populated from UIDAI Aadhaar database.'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'आधार संख्या (12 अंक):' : 'Aadhaar Number (12 digits):'}
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={formatAadhaarNumber(aadhaarInput)}
                  onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="2345 6789 0123"
                  className="w-full font-mono text-base font-bold tracking-wider px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              {/* Demo Hint */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {isHi ? 'परीक्षण डेमो आधार:' : 'Test Demo Aadhaar:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAadhaarInput('234567890123');
                    handleSendAadhaarOtp('234567890123');
                  }}
                  className="font-mono font-bold text-red-700 hover:text-red-800 underline cursor-pointer"
                >
                  2345 6789 0123 (रवि शंकर सिंह)
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSendAadhaarOtp()}
                disabled={isLoading || aadhaarInput.length !== 12}
                className="w-full py-2.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{isHi ? 'आधार OTP भेजें' : 'Generate Aadhaar OTP'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'input_otp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    {isHi ? 'आधार संख्या:' : 'Aadhaar:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {maskAadhaarNumber(aadhaarInput)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">
                    {isHi ? 'लिंक्ड मोबाइल:' : 'Linked Mobile:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900">+91 {maskedMobile}</span>
                </div>
              </div>

              {/* Dev Test Quick Auto-fill */}
              {activeGeneratedOtp && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-red-900">
                    <Sparkles size={14} className="text-red-600" />
                    <span>UIDAI OTP: <strong className="font-mono text-sm">{activeGeneratedOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpValue(activeGeneratedOtp);
                      handleVerifyAadhaarOtp(activeGeneratedOtp);
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold text-[11px] px-2.5 py-1 rounded shadow-xs cursor-pointer"
                  >
                    {isHi ? 'स्वतः भरें व प्रमाणित करें' : 'Auto-Fill & Authenticate'}
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? '6 अंकों का आधार OTP दर्ज करें:' : 'Enter 6-digit Aadhaar OTP:'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {countdown > 0 ? (
                    `${isHi ? 'पुनः भेजें' : 'Resend OTP in'}: ${countdown}s`
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendAadhaarOtp()}
                      className="font-bold text-red-700 hover:text-red-800 underline cursor-pointer"
                    >
                      {isHi ? 'OTP पुनः भेजें' : 'Resend Aadhaar OTP'}
                    </button>
                  )}
                </span>
                <span className="text-[11px]">Bypass Master PIN: <strong>123456</strong></span>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyAadhaarOtp()}
                disabled={isLoading || otpValue.length !== 6}
                className="w-full py-2.5 text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>{isHi ? 'e-KYC सत्यापित करें' : 'Authenticate e-KYC'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'success_preview' && verifiedEkyc && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    {isHi ? 'UIDAI e-KYC प्रमाणीकरण सफल!' : 'UIDAI e-KYC Authentication Successful!'}
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    {isHi
                      ? 'नागरिक पहचान व पता आधार डेटाबेस से सत्यापित हो चुका है।'
                      : 'Citizen demographic & address record verified from UIDAI register.'}
                  </p>
                </div>
              </div>

              {/* Demographics Card */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">
                      {isHi ? 'पूरा नाम (Full Name)' : 'Full Name'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{verifiedEkyc.fullName}</span>
                    {verifiedEkyc.fullNameHi && (
                      <span className="text-xs text-emerald-800 font-semibold block">हिंदी: {verifiedEkyc.fullNameHi}</span>
                    )}
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-300">
                    UIDAI Verified ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">पिता/पति का नाम:</span>
                    <span className="font-semibold text-slate-900">{verifiedEkyc.fatherHusbandName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">जन्म तिथि / लिंग:</span>
                    <span className="font-semibold text-slate-900">{verifiedEkyc.dob} | {verifiedEkyc.gender}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-[11px]">
                  <span className="text-slate-500 block">सत्यापित पता (Verified Address):</span>
                  <span className="font-semibold text-slate-900">{verifiedEkyc.addressLine}, {verifiedEkyc.villageWard}, {verifiedEkyc.tehsil}, {verifiedEkyc.district}, {verifiedEkyc.state} - {verifiedEkyc.pinCode}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyEkycData}
                className="btn-primary w-full py-2.5 text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck2 size={16} />
                <span>{isHi ? 'सत्यापित विवरण फॉर्म में भरें' : 'Apply Verified e-KYC to Form'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
