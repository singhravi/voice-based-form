import React, { useState, useEffect } from 'react';
import {
  Phone,
  X,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Language, CitizenProfile } from '../types';
import { requestMobileOtp, verifyMobileOtp } from '../utils/authService';
import { getCitizenProfile } from '../utils/citizenStorage';

interface MobileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'verify_field' | 'login';
  initialMobile?: string;
  language: Language;
  onVerified: (mobileNumber: string, profile?: CitizenProfile | null) => void;
}

export const MobileAuthModal: React.FC<MobileAuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialMobile = '',
  language,
  onVerified
}) => {
  const isHi = language === 'hi';
  const [mobileNumber, setMobileNumber] = useState(initialMobile);
  const [otpStep, setOtpStep] = useState<'input_mobile' | 'input_otp'>('input_mobile');
  const [otpValue, setOtpValue] = useState('');
  const [activeGeneratedOtp, setActiveGeneratedOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (isOpen) {
      setMobileNumber(initialMobile.replace(/\D/g, '').slice(-10));
      setOtpValue('');
      setErrorMsg(null);
      if (initialMobile.replace(/\D/g, '').slice(-10).length === 10) {
        // Auto trigger OTP request if 10-digit provided in verify mode
        handleSendOtp(initialMobile.replace(/\D/g, '').slice(-10));
      } else {
        setOtpStep('input_mobile');
      }
    }
  }, [isOpen, initialMobile]);

  useEffect(() => {
    let timer: any;
    if (otpStep === 'input_otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

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

  const handleSendOtp = (targetMobile?: string) => {
    const mob = (targetMobile || mobileNumber).replace(/\D/g, '').slice(-10);
    if (mob.length !== 10) {
      setErrorMsg(isHi ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = requestMobileOtp(mob);
    setIsLoading(false);

    if (res.success) {
      setActiveGeneratedOtp(res.otp);
      setOtpStep('input_otp');
      setCountdown(30);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyOtp = (codeToVerify?: string) => {
    const code = codeToVerify || otpValue;
    if (code.trim().length !== 6) {
      setErrorMsg(isHi ? 'कृपया 6 अंकों का OTP दर्ज करें।' : 'Please enter 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const cleanMob = mobileNumber.replace(/\D/g, '').slice(-10);
    const res = verifyMobileOtp(cleanMob, code);
    setIsLoading(false);

    if (res.verified) {
      const existingProfile = getCitizenProfile(cleanMob);
      onVerified(cleanMob, existingProfile);
      onClose();
    } else {
      setErrorMsg(res.message);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-slideUp cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0a5c44] to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Phone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                {mode === 'login'
                  ? isHi ? 'नागरिक लॉगिन (Citizen Login)' : 'Citizen Mobile Login'
                  : isHi ? 'मोबाइल सत्यापन (OTP Verify)' : 'Mobile OTP Verification'}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {mode === 'login'
                  ? isHi ? 'मोबाइल नंबर से लॉगिन करें' : 'Sign in with Mobile OTP'
                  : isHi ? 'मोबाइल नंबर सत्यापित करें' : 'Verify Mobile Number'}
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
        <div className="p-5 sm:p-6 space-y-4">
          {otpStep === 'input_mobile' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {mode === 'login'
                  ? isHi
                    ? 'अपना पंजीकृत 10 अंकों का मोबाइल नंबर दर्ज करें। आपके नंबर पर 6 अंकों का OTP भेजा जाएगा जिससे आपका प्रोफाइल व परिवार का डेटा स्वतः लोड हो जाएगा।'
                    : 'Enter your 10-digit mobile number. We will send a 6-digit OTP to authenticate and retrieve your citizen profile & family members.'
                  : isHi
                    ? 'आवेदन की वैधता सुनिश्चित करने के लिए कृपया अपना मोबाइल नंबर OTP के माध्यम से सत्यापित करें।'
                    : 'Please verify your mobile number via OTP for authentic service notifications.'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'मोबाइल नंबर (10 अंक):' : 'Mobile Number (10 digits):'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full text-sm font-semibold pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>
              </div>

              {/* Demo Hint */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {isHi ? 'परीक्षण डेमो नंबर:' : 'Demo Test Profile:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileNumber('9876543210');
                    handleSendOtp('9876543210');
                  }}
                  className="font-mono font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  9876543210 (रवि शंकर सिंह)
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
                onClick={() => handleSendOtp()}
                disabled={isLoading || mobileNumber.length !== 10}
                className="btn-primary w-full py-2.5 text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{isHi ? 'OTP भेजें' : 'Send Verification OTP'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    {isHi ? 'OTP भेजा गया:' : 'OTP Sent To:'}
                  </span>
                  <span className="font-bold text-slate-900">+91 {mobileNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpStep('input_mobile')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  {isHi ? 'नंबर बदलें' : 'Change Number'}
                </button>
              </div>

              {/* Dev Test Quick Auto-fill badge */}
              {activeGeneratedOtp && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>Dev OTP: <strong className="font-mono text-sm">{activeGeneratedOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpValue(activeGeneratedOtp);
                      handleVerifyOtp(activeGeneratedOtp);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-1 rounded shadow-xs cursor-pointer"
                  >
                    {isHi ? 'स्वतः भरें व सत्यापित करें' : 'Auto-Fill & Verify'}
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? '6 अंकों का OTP दर्ज करें:' : 'Enter 6-digit OTP:'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
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
                      onClick={() => handleSendOtp()}
                      className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                    >
                      {isHi ? 'OTP पुनः भेजें (Resend)' : 'Resend OTP'}
                    </button>
                  )}
                </span>
                <span className="text-[11px]">Bypass Master PIN: <strong>123456</strong></span>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isLoading || otpValue.length !== 6}
                className="btn-primary w-full py-2.5 text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>{isHi ? 'सत्यापित करें एवं आगे बढ़ें' : 'Verify & Continue'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
