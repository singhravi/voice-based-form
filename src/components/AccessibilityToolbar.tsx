import React, { useEffect, useState } from 'react';
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  Accessibility, 
  HelpCircle
} from 'lucide-react';

interface AccessibilityToolbarProps {
  isHi?: boolean;
  onAnnounceMessage?: string;
  onVoiceFeedbackToggle?: (enabled: boolean) => void;
  voiceFeedbackEnabled?: boolean;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  isHi = true,
  onAnnounceMessage = '',
  onVoiceFeedbackToggle,
  voiceFeedbackEnabled = true
}) => {
  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('uk_font_scale');
    return saved ? Number(saved) : 100;
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('uk_high_contrast') === 'true';
  });

  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('uk_voice_feedback');
    return saved !== null ? saved === 'true' : voiceFeedbackEnabled;
  });

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Apply Font Scaling to document root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    localStorage.setItem('uk_font_scale', String(fontScale));
  }, [fontScale]);

  // Apply High Contrast Mode
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
    localStorage.setItem('uk_high_contrast', String(isHighContrast));
  }, [isHighContrast]);

  const handleFontIncrease = () => {
    setFontScale((prev) => Math.min(prev + 15, 145));
  };

  const handleFontDecrease = () => {
    setFontScale((prev) => Math.max(prev - 15, 85));
  };

  const handleFontReset = () => {
    setFontScale(100);
  };

  const handleToggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const handleToggleVoice = () => {
    const next = !isVoiceActive;
    setIsVoiceActive(next);
    localStorage.setItem('uk_voice_feedback', String(next));
    onVoiceFeedbackToggle?.(next);
  };

  return (
    <>
      {/* Hidden Live Region for Screen Readers (NVDA / TalkBack / VoiceOver) */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="accessible-live-announcer"
      >
        {onAnnounceMessage}
      </div>

      {/* Accessibility Bar Top Banner */}
      <header 
        aria-label={isHi ? "सुलभता एवं दिव्यांगजन सहायता टूलबार" : "Accessibility & Universal Inclusion Toolbar"} 
        className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 py-1 px-3 sm:px-6 transition-colors shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Inclusion Badge */}
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
              <Accessibility size={13} className="text-emerald-400" />
              <span>{isHi ? 'सर्व-समावेशी सहायता (Universal Inclusivity)' : 'Universal Inclusion Suite'}</span>
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              {isHi ? 'निरक्षर, दृष्टिबाधित एवं दिव्यांगजनों के लिए सुगम' : 'Accessible for all citizen abilities'}
            </span>
          </div>

          {/* Controls Group */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-2">
            
            {/* Font Sizing Controls */}
            <div className="flex items-center bg-slate-800/90 rounded border border-slate-700 p-0.5">
              <span className="text-[10px] text-slate-400 px-1.5 font-bold">
                {isHi ? 'अक्षर आकार:' : 'Text Size:'}
              </span>
              <button
                type="button"
                onClick={handleFontDecrease}
                title={isHi ? "अक्षर छोटा करें (A-)" : "Decrease font size"}
                className="px-2 py-0.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-bold transition flex items-center gap-0.5"
                aria-label="Decrease text size"
              >
                <ZoomOut size={11} /> A-
              </button>
              <button
                type="button"
                onClick={handleFontReset}
                title={isHi ? "सामान्य अक्षर आकार (A)" : "Reset font size"}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  fontScale === 100 
                    ? 'bg-emerald-700 text-white' 
                    : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                aria-label="Reset text size"
              >
                A ({fontScale}%)
              </button>
              <button
                type="button"
                onClick={handleFontIncrease}
                title={isHi ? "अक्षर बड़ा करें (A+)" : "Increase font size"}
                className="px-2 py-0.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-bold transition flex items-center gap-0.5"
                aria-label="Increase text size"
              >
                <ZoomIn size={11} /> A+
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleHighContrast}
              title={isHi ? "उच्च कंट्रास्ट मोड बदलें (काला और पीला)" : "Toggle High Contrast Black & Yellow Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold transition ${
                isHighContrast
                  ? 'bg-yellow-400 border-yellow-300 text-black font-black ring-2 ring-yellow-400'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
              aria-pressed={isHighContrast}
            >
              <Eye size={12} className={isHighContrast ? 'text-black' : 'text-amber-400'} />
              <span>{isHighContrast ? (isHi ? 'कंट्रास्ट: चालू ✓' : 'High Contrast: ON') : (isHi ? 'उच्च कंट्रास्ट' : 'High Contrast')}</span>
            </button>

            {/* Voice Audio Feedback Toggle */}
            <button
              type="button"
              onClick={handleToggleVoice}
              title={isHi ? "ऑडियो आवाज़ प्रतिपुष्टि चालू/बंद करें" : "Toggle Spoken Audio Feedback"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold transition ${
                isVoiceActive
                  ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={isVoiceActive}
            >
              {isVoiceActive ? (
                <>
                  <Volume2 size={12} className="text-emerald-400 animate-pulse" />
                  <span>{isHi ? 'ऑडियो फ़ीडबैक: चालू' : 'Audio Echo: ON'}</span>
                </>
              ) : (
                <>
                  <VolumeX size={12} className="text-slate-400" />
                  <span>{isHi ? 'ऑडियो: मूक' : 'Audio: Mute'}</span>
                </>
              )}
            </button>

            {/* Accessibility Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              title={isHi ? "दिव्यांगजन एवं सुलभता सहायता मार्गदर्शिका" : "Accessibility & Inclusion Guide"}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 font-medium transition"
            >
              <HelpCircle size={12} className="text-blue-400" />
              <span className="hidden sm:inline">{isHi ? 'सुलभता सहायता' : 'Help'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Universal Inclusion Guide Modal */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-guide-title"
        >
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                  <Accessibility size={20} />
                </div>
                <div>
                  <h2 id="accessibility-guide-title" className="text-base font-bold text-slate-100">
                    {isHi ? 'सर्व-समावेशी नागरिक सुलभता मार्गदर्शिका' : 'Universal Citizen Accessibility Guide'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isHi ? 'सभी नागरिकों के लिए सहज, सुगम एवं पारदर्शी' : 'Designed for all abilities and literacy levels'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex gap-3 items-start">
                <span className="text-xl">🎙️</span>
                <div>
                  <strong className="text-emerald-300 text-sm block mb-0.5">
                    {isHi ? 'निरक्षर एवं कम पढ़े-लिखे नागरिकों के लिए:' : 'For Non-Literate Citizens:'}
                  </strong>
                  <p>
                    {isHi 
                      ? 'माइक बटन दबाकर सिर्फ बोलें। हर फ़ील्ड के पास लाउडस्पीकर बटन दबाने से कंप्यूटर बोलकर समझाएगा कि क्या भरना है। फ़ील्ड में तस्वीर व चिन्ह (Icons) भी दिए गए हैं।'
                      : 'Simply speak into the mic. Tap the speaker button to hear spoken instructions in Hindi. Pictograms and visual cues guide every step.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex gap-3 items-start">
                <span className="text-xl">👁️</span>
                <div>
                  <strong className="text-amber-300 text-sm block mb-0.5">
                    {isHi ? 'दृष्टिबाधित / कम दृष्टि वाले नागरिकों के लिए:' : 'For Low-Vision Citizens:'}
                  </strong>
                  <p>
                    {isHi 
                      ? 'शीर्ष टूलबार से "A+" दबाकर अक्षर 145% तक बड़े करें। "उच्च कंट्रास्ट" चालू करने पर काला और चमकीला पीला रंग सक्रिय होगा।'
                      : 'Use A+ to enlarge text up to 145%. Enable High Contrast mode for high-visibility black and yellow display.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex gap-3 items-start">
                <span className="text-xl">🦾</span>
                <div>
                  <strong className="text-blue-300 text-sm block mb-0.5">
                    {isHi ? 'हाथ न चला पाने / दिव्यांग नागरिकों के लिए:' : 'For Motor-Impaired Citizens:'}
                  </strong>
                  <p>
                    {isHi 
                      ? 'बिना कीबोर्ड या माउस के पूरी तरह आवाज़ से फॉर्म भरें। "कैमरा खोलो", "फॉर्म सबमिट करो", या "ऊपर जाओ" जैसे सीधे आदेश बोलें।'
                      : '100% hands-free voice commands. Say "कैमरा खोलो" (Open Camera) or "फॉर्म सबमिट करो" (Submit) directly.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                {isHi ? 'समझ गया, धन्यवाद (Close)' : 'Got it, Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
