import React, { useState, useEffect } from 'react';
import { Mic, Sparkles, X, Check, ArrowRight, RotateCcw, AlertCircle, Edit3, CheckCircle2 } from 'lucide-react';
import { voiceAssistantService } from '../utils/voiceAssistant';
import { CitizenFormData, Language, VoiceRecognitionResult } from '../types';
import { parseUttarakhandName, parseBilingualAddress } from '../utils/uttarakhandPhonetics';

interface VoiceFloatingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceData: (fields: Array<{ fieldKey: keyof CitizenFormData; value: string; displayLabel: string }>) => void;
  onExecuteCommand?: (command: 'openCamera' | 'submitForm' | 'scrollTop' | 'resetForm' | 'openGuidedVoice') => void;
  language: Language;
}

interface StagedVoiceCorrection {
  transcript: string;
  fields: Array<{
    fieldKey: keyof CitizenFormData;
    value: string;
    displayLabel: string;
    hindiValue?: string;
  }>;
}

export const VoiceFloatingAssistant: React.FC<VoiceFloatingAssistantProps> = ({
  isOpen,
  onClose,
  onApplyVoiceData,
  onExecuteCommand,
  language
}) => {
  const isHi = language === 'hi';
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [stagedCorrection, setStagedCorrection] = useState<StagedVoiceCorrection | null>(null);
  const [recentMatches, setRecentMatches] = useState<Array<{ fieldKey: keyof CitizenFormData; value: string; displayLabel: string }>>([]);
  const [statusMessage, setStatusMessage] = useState(
    isHi ? 'माइक पर क्लिक करके बोलें...' : 'Click the microphone and speak...'
  );

  useEffect(() => {
    voiceAssistantService.setLanguage(language);
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      voiceAssistantService.stopListening();
      setIsListening(false);
      setStatusMessage(isHi ? 'माइक रुका हुआ है' : 'Microphone paused');
    } else {
      setInterimText('');
      setStagedCorrection(null);
      setStatusMessage(isHi ? 'सुन रहा हूँ... कृपया बोलें' : 'Listening... please speak');

      voiceAssistantService.startListening(
        (interim) => {
          setInterimText(interim);
        },
        (result: VoiceRecognitionResult) => {
          setInterimText('');

          // 1. Check for global voice commands
          if (result.commandAction) {
            onExecuteCommand?.(result.commandAction);
            const actionLabels: Record<string, string> = {
              openCamera: isHi ? 'कैमरा स्टूडियो खोला जा रहा है...' : 'Opening camera studio...',
              submitForm: isHi ? 'आवेदन समीक्षा खोली जा रही है...' : 'Opening application review...',
              scrollTop: isHi ? 'शीर्ष पर जाया जा रहा है...' : 'Scrolling to top...',
              resetForm: isHi ? 'फॉर्म रीसेट किया गया' : 'Reset form triggered',
              openGuidedVoice: isHi ? 'ऑडियो गाइड मोड शुरू हो रहा है...' : 'Starting voice guide flow...'
            };
            const msg = actionLabels[result.commandAction] || 'आदेश निष्पादित';
            setStatusMessage(msg);
            voiceAssistantService.speakFeedback(msg, isHi ? 'hi' : 'en');
            return;
          }

          if (result.fieldMatches.length > 0) {
            // Stage the recognized fields for user verification & correction
            const stagedFields = result.fieldMatches.map((m) => {
              let hiVal: string | undefined;
              if (m.fieldKey === 'fullName' || m.fieldKey === 'fatherHusbandName' || m.fieldKey === 'motherName') {
                const names = parseUttarakhandName(m.value);
                hiVal = names.hindiName;
              } else if (m.fieldKey === 'villageWard' || m.fieldKey === 'postOffice' || m.fieldKey === 'addressLine') {
                const addr = parseBilingualAddress(m.value);
                hiVal = addr.hindi;
              }
              return {
                fieldKey: m.fieldKey,
                value: m.value,
                displayLabel: m.displayLabel,
                hindiValue: hiVal
              };
            });

            setStagedCorrection({
              transcript: result.transcript,
              fields: stagedFields
            });

            setStatusMessage(
              isHi
                ? 'सुने गए विवरण की समीक्षा करें और आवश्यकता होने पर सुधारें'
                : 'Review transcribed fields and edit if needed'
            );
          } else {
            setStatusMessage(
              isHi
                ? `सुना: "${result.transcript}" (कृपया नाम, जिला, जन्मतिथि या आदेश जैसे "कैमरा खोलो" स्पष्ट बोलें)`
                : `Heard: "${result.transcript}" (Please speak clearly)`
            );
          }
        },
        (err) => {
          setStatusMessage(`त्रुटि (Error): ${err}`);
          setIsListening(false);
        },
        (state) => {
          setIsListening(state);
        }
      );
    }
  };

  const handleUpdateStagedFieldValue = (index: number, newValue: string) => {
    if (!stagedCorrection) return;
    const updated = [...stagedCorrection.fields];
    let hiVal: string | undefined;
    if (updated[index].fieldKey === 'fullName' || updated[index].fieldKey === 'fatherHusbandName' || updated[index].fieldKey === 'motherName') {
      const names = parseUttarakhandName(newValue);
      hiVal = names.hindiName;
    }
    updated[index] = {
      ...updated[index],
      value: newValue,
      hindiValue: hiVal
    };
    setStagedCorrection({
      ...stagedCorrection,
      fields: updated
    });
  };

  const handleApplyStagedCorrection = () => {
    if (!stagedCorrection || stagedCorrection.fields.length === 0) return;

    const fieldsToApply = stagedCorrection.fields.map((f) => ({
      fieldKey: f.fieldKey,
      value: f.value,
      displayLabel: f.displayLabel
    }));

    setRecentMatches((prev) => [...fieldsToApply, ...prev]);
    onApplyVoiceData(fieldsToApply);

    const firstMatch = fieldsToApply[0];
    const speakText = isHi
      ? `${firstMatch.displayLabel} दर्ज कर दिया गया है`
      : `${firstMatch.displayLabel} updated`;
    voiceAssistantService.speak(speakText, language);

    setStatusMessage(
      isHi
        ? `सफलता: ${fieldsToApply.length} विवरण फॉर्म में भरे गए`
        : `Updated ${fieldsToApply.length} field(s)`
    );

    setStagedCorrection(null);
  };

  const handleDiscardStagedCorrection = () => {
    setStagedCorrection(null);
    setStatusMessage(isHi ? 'रद्द किया गया। माइक दबाकर पुनः बोलें।' : 'Discarded. Tap mic to speak again.');
  };

  const handleRespeak = () => {
    setStagedCorrection(null);
    toggleListening();
  };

  const sampleVoicePrompts = isHi
    ? [
        'मेरा नाम राजेश नेगी है',
        'पिता का नाम बीरेंद्र नेगी',
        'जन्म तिथि 14 मई 1996',
        'मोबाइल नंबर 9897123456',
        'जिला देहरादून',
        'तहसील विकासनगर',
        'पिन कोड 248198',
        'वार्षिक आय 60000',
        'लिंग पुरुष'
      ]
    : [
        'My name is Ramesh Singh',
        'Father name is Birendra Singh',
        'Date of birth 14 August 1995',
        'Mobile number 9897112233',
        'District Almora',
        'Tehsil Ranikhet',
        'PIN code 263645',
        'Annual income 80000'
      ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[92vw] sm:w-[440px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-300 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight">
              {isHi ? 'उत्तराखंड ई-सेवा ध्वनि सहायक' : 'Uttarakhand Voice Assistant'}
            </h3>
            <p className="text-[11px] text-purple-200">
              {isHi ? 'सटीक पहचान व सुधार विकल्प के साथ' : 'Speech-to-Text with In-Place Correction'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (isListening) toggleListening();
            onClose();
          }}
          className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Pulsing Mic Visualizer */}
        <div className="flex flex-col items-center justify-center py-3 bg-purple-50/50 rounded-xl border border-purple-100">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
              isListening
                ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white scale-110 shadow-rose-200 ring-8 ring-purple-200 animate-pulse'
                : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:scale-105 shadow-purple-200'
            }`}
          >
            {isListening ? <Mic size={32} className="animate-bounce" /> : <Mic size={32} />}
          </button>

          {/* Waveform Indicator */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1 bg-purple-600 rounded-full animate-[voice-wave_0.8s_ease-in-out_infinite]" />
              <span className="w-1 bg-purple-500 rounded-full animate-[voice-wave_0.6s_ease-in-out_infinite_0.2s]" />
              <span className="w-1 bg-indigo-600 rounded-full animate-[voice-wave_1s_ease-in-out_infinite_0.4s]" />
              <span className="w-1 bg-purple-600 rounded-full animate-[voice-wave_0.7s_ease-in-out_infinite_0.1s]" />
              <span className="w-1 bg-purple-400 rounded-full animate-[voice-wave_0.9s_ease-in-out_infinite_0.3s]" />
            </div>
          )}

          <p className="text-xs font-semibold text-purple-900 mt-2 text-center px-4">
            {statusMessage}
          </p>

          {interimText && (
            <div className="mt-2 text-xs italic text-slate-600 bg-white px-3 py-1 rounded-lg border border-purple-200 max-w-[90%] truncate">
              "{interimText}"
            </div>
          )}
        </div>

        {/* STAGED TRANSCRIPTION REVIEW & CORRECTION CARD */}
        {stagedCorrection && (
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-3.5 shadow-md animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200 mb-2.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <AlertCircle size={15} className="text-amber-600" />
                <span>{isHi ? 'सुने गए विवरण की जाँच व सुधार करें:' : 'Review & Correct Speech Output:'}</span>
              </div>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                {isHi ? 'सत्यापन आवश्यक' : 'Verification'}
              </span>
            </div>

            <div className="text-[11px] text-slate-600 mb-2 italic bg-white/80 p-1.5 rounded border border-amber-200">
              <span className="font-semibold text-slate-700">{isHi ? 'ऑडियो से सुना गया: ' : 'Heard: '}</span>
              "{stagedCorrection.transcript}"
            </div>

            {/* Editable Field Inputs */}
            <div className="space-y-2.5 my-2">
              {stagedCorrection.fields.map((field, idx) => (
                <div key={idx} className="bg-white rounded-lg p-2 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-purple-900">
                      {field.displayLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Edit3 size={10} />
                      {isHi ? 'त्रुटि हो तो बदलें' : 'Edit if wrong'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleUpdateStagedFieldValue(idx, e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded border border-purple-200 focus:border-purple-600 focus:bg-white outline-none"
                    placeholder={field.displayLabel}
                  />
                  {field.hindiValue && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200 font-medium">
                      {isHi ? 'हिंदी अनुवाद:' : 'Devanagari:'} <span className="font-bold">{field.hindiValue}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons: Confirm, Re-speak, Discard */}
            <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
              <button
                type="button"
                onClick={handleApplyStagedCorrection}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check size={14} />
                <span>{isHi ? 'सही है, फॉर्म में भरें' : 'Confirm & Apply'}</span>
              </button>
              <button
                type="button"
                onClick={handleRespeak}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-1.5 px-2.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                title={isHi ? 'पुनः बोलें' : 'Re-speak'}
              >
                <RotateCcw size={13} />
                <span>{isHi ? 'पुनः बोलें' : 'Re-speak'}</span>
              </button>
              <button
                type="button"
                onClick={handleDiscardStagedCorrection}
                className="bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-semibold py-1.5 px-2 rounded-lg text-xs cursor-pointer"
                title={isHi ? 'रद्द करें' : 'Discard'}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Quick Voice Suggestion Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            {isHi ? 'उदाहरण के लिए ऐसे बोलें (Try saying):' : 'Suggested Voice Commands:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoicePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const parsed = voiceAssistantService.parseVoiceIntent(prompt);
                  if (parsed.fieldMatches.length > 0) {
                    const stagedFields = parsed.fieldMatches.map((m) => {
                      let hiVal: string | undefined;
                      if (m.fieldKey === 'fullName' || m.fieldKey === 'fatherHusbandName' || m.fieldKey === 'motherName') {
                        const names = parseUttarakhandName(m.value);
                        hiVal = names.hindiName;
                      } else if (m.fieldKey === 'villageWard' || m.fieldKey === 'postOffice' || m.fieldKey === 'addressLine') {
                        const addr = parseBilingualAddress(m.value);
                        hiVal = addr.hindi;
                      }
                      return {
                        fieldKey: m.fieldKey,
                        value: m.value,
                        displayLabel: m.displayLabel,
                        hindiValue: hiVal
                      };
                    });

                    setStagedCorrection({
                      transcript: prompt,
                      fields: stagedFields
                    });
                  }
                }}
                className="text-[11px] font-medium bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 text-left cursor-pointer"
              >
                <span>"{prompt}"</span>
                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Recognized Matches */}
        {recentMatches.length > 0 && (
          <div className="border-t border-slate-200 pt-3">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-2">
              <CheckCircle2 size={13} />
              {isHi ? 'हाल में स्वीकृत किए गए विवरण:' : 'Recently Confirmed Fields:'}
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {recentMatches.slice(0, 5).map((match, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center justify-between"
                >
                  <span className="font-semibold">{match.displayLabel}:</span>
                  <span className="font-bold text-emerald-950 truncate max-w-[150px]">
                    {match.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">
          {isHi ? 'भाषा: हिंदी (भारत) / अंग्रेजी' : 'Language: Hindi / English (India)'}
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 font-semibold text-purple-700 hover:text-purple-900 rounded-lg cursor-pointer"
        >
          {isHi ? 'समाप्त (Done)' : 'Done'}
        </button>
      </div>
    </div>
  );
};

