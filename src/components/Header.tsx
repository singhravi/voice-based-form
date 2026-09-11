import React from 'react';
import { Language } from '../types';
import { Mic, Phone, Shield, Sparkles, User, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onToggleVoiceModal: () => void;
  isVoiceActive: boolean;
  onOpenPrivacyNotice?: () => void;
  onOpenLoginModal?: () => void;
  activeCitizenName?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onToggleVoiceModal,
  isVoiceActive,
  onOpenPrivacyNotice,
  onOpenLoginModal,
  activeCitizenName,
  onLogout
}) => {
  const isHi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Gov Banner */}
      <div className="bg-[#0a5c44] text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>उत्तराखंड शासन | Government of Uttarakhand</span>
          <span className="hidden md:inline text-emerald-200">| e-District 2.0 AI Portal</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-emerald-100">
          {onOpenPrivacyNotice && (
            <button
              onClick={onOpenPrivacyNotice}
              className="flex items-center gap-1 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-500/40 text-amber-300 hover:text-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="DPDP Act 2023 & DPDP Rules 2025 Privacy Notice"
            >
              <Shield size={12} />
              <span>DPDP 2023/2025 Notice</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 hover:text-white">
            <Phone size={13} />
            <span>Toll-Free: 1800-180-2525 / 1905</span>
          </div>
          <div className="hidden xs:flex items-center gap-1 bg-[#06402f] px-2 py-0.5 rounded text-amber-300 font-semibold">
            <Shield size={12} />
            <span>Govt. Verified</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 flex items-center justify-center text-white shadow-md border-2 border-amber-400">
              {/* Uttarakhand Mountain Emblem Icon */}
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="rgba(255,255,255,0.2)" stroke="white" />
                <path d="M4 21c3-4 6-2 9-5 2-2 4-2 7 0" stroke="#fde047" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-[10px] font-bold text-slate-900 px-1 rounded shadow-sm">
              UK
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                {isHi ? 'ई-सेवा उत्तराखंड' : 'e-District Uttarakhand'}
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles size={12} className="text-emerald-600" />
                  AI Smart Fill
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isHi
                ? 'दस्तावेज़ स्वतः प्रविष्टि एवं बोलकर फॉर्म भरने की सुविधा (<200KB संपीड़न)'
                : 'Smart Document Auto-Fill & Voice Form Assistant (<200KB Auto-Compress)'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Citizen Login / Profile Button */}
          {activeCitizenName ? (
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded-lg p-1 text-xs">
              <div className="flex items-center gap-1.5 px-2 py-1 text-emerald-900 font-bold max-w-[140px] sm:max-w-[180px] truncate">
                <User size={14} className="text-emerald-700 shrink-0" />
                <span className="truncate">{activeCitizenName}</span>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 text-slate-500 hover:text-rose-600 rounded transition-colors"
                  title={isHi ? 'लॉगआउट करें' : 'Logout'}
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          ) : onOpenLoginModal ? (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
            >
              <LogIn size={15} />
              <span className="hidden sm:inline">
                {isHi ? 'नागरिक लॉगिन' : 'Citizen Login'}
              </span>
              <span className="sm:hidden">Login</span>
            </button>
          ) : null}

          {/* Voice Assistant Toggle */}
          <button
            onClick={onToggleVoiceModal}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer ${
              isVoiceActive
                ? 'bg-purple-600 text-white shadow-purple-200 animate-pulse'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
            title="बोलकर फॉर्म भरें (Voice Form Fill)"
          >
            <Mic size={16} className={isVoiceActive ? 'animate-bounce' : ''} />
            <span className="hidden sm:inline">
              {isHi ? 'ध्वनि सहायक' : 'Voice Assistant'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                isHi
                  ? 'bg-[#0a5c44] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                !isHi
                  ? 'bg-[#0a5c44] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
